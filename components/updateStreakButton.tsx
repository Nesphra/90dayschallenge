"use client"
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from './ui/button';

const UpdateStreakButton = ({ streakId }: { streakId: string }) => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const increment = async () => {
        setLoading(true);
        
        const { data: currentStreak } = await supabase
            .from("streaks")
            .select('streak')
            .eq('id', streakId)
            .single();
        
        const { error } = await supabase
            .from("streaks")
            .update({ streak: (currentStreak?.streak || 0) + 1 })
            .eq('id', streakId);

        setLoading(false);
        if (error) {
            console.error(error.message);
        } else {
            const { data } = await supabase.from("streaks").select('streak').eq('id', streakId);
            console.log("Current streak:", data?.[0]?.streak);
        }
    };

    return ( 
        <Button onClick={increment} disabled={loading}>
            {loading ? "Updating..." : "Update Streak"}
        </Button>
    );
}

export default UpdateStreakButton;