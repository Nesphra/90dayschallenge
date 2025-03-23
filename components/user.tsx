"use client";

import { createClient } from '@/utils/supabase/client';
import { Open_Sans } from "next/font/google";
import Canvas from '@/components/canvas';
import Quote from '@/components/quote';
import AddStreakButton from '@/components/AddStreakButton';
import { useState, useEffect } from 'react';

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"], // Adjust weight if needed
});

const User = () => {
    const [streaks, setStreaks] = useState<{ streak_id: string; title: string; date_created: string; streakDate: string[]; }[]>([]);
    const [user, setUser] = useState<{ id: string } | null>(null);

    const fetchStreaks = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        setUser(user);

        const { data: streaksData, error } = await supabase
            .from('streaks')
            .select()
            .eq('user_id', user.id);

        if (error) {
            console.error("Error fetching streaks:", error);
            return;
        }

        setStreaks(streaksData);
    };

    const handleRemoveStreak = async (streakID: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("streaks")
            .delete()
            .eq("streak_id", streakID);

        if (error) {
            console.error("Error deleting streak:", error);
        } else {
            console.log("Streak successfully deleted.");
            fetchStreaks(); // Refetch streaks after deletion
        }
    };

    useEffect(() => {
        fetchStreaks();
    }, []);

    return (
        <div className="flex-1 p-6 flex flex-col items-center text-center justify-between h-full gap-6">
            <div>
                <h1 className={`text-4xl font-bold ${openSans.className}`}>MY BRAIN</h1>
                <p>Every day is a massive win. Keep the goal in mind.</p>
            </div>
            {streaks?.map((streak) => (
                <Canvas
                    key={streak.streak_id}
                    isUser={true}
                    userID={user?.id || ''}
                    title={streak.title}
                    date_created={streak.date_created}
                    streakDate={streak.streakDate || []}
                    streakID={streak.streak_id}
                />
            ))}
            <AddStreakButton onAdd={fetchStreaks} />
            <Quote />
        </div>
    );
};

export default User;
