"use client";

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

type AddStreakButtonProps = {
  onAdd: () => Promise<void>;
};

const AddStreakButton = ({ onAdd }: AddStreakButtonProps) => {
    const handleAddStreak = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        const { error } = await supabase
            .from("streaks")
            .insert({
                user_id: user.id,
                title: "New Streak",
                streakDate: [],
                date_created: today,
                quote: "Come back tomorrow for your daily motivation.",
            });

        if (error) {
            console.error("Error creating streak:", error);
        } else {
            await onAdd(); // Call onAdd to refetch streaks
        }
    };

    return (
        <Button onClick={handleAddStreak} className="mt-4">
            Add Streak
        </Button>
    );
};

export default AddStreakButton; 