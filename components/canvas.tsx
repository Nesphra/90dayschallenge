'use client'

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from './ui/button';
import Progressgrid from '@/components/progressGrid';

type CanvasProps = {
  streak: number; // Initial streak value from the server
  streakId: string;
  last_logged: string;
};

const Canvas = ({ streak: initialStreak, streakId, last_logged: initialLastLogged }: CanvasProps) => {
  const supabase = createClient();
  
  // Local state to manage streak, last_logged, and loading state
  const [streak, setStreak] = useState<number>(initialStreak);
  const [lastLogged, setLastLogged] = useState<string>(initialLastLogged);
  const [loading, setLoading] = useState<boolean>(false);

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split("T")[0];

  // Check if the streak has already been updated today
  const alreadyUpdated = todayDate === lastLogged;

  // Function to increment the streak and update last_day_logged
  const increment = async () => {
    if (alreadyUpdated) return; // Prevent unnecessary calls

    setLoading(true);
    
    const { error } = await supabase
      .from("streaks")
      .update({ streak: streak + 1, last_day_logged: todayDate })
      .eq('id', streakId);

    if (error) {
      console.error('Error updating streak:', error.message);
    } else {
      // Fetch the updated streak value and last_logged
      const { data } = await supabase
        .from("streaks")
        .select('streak, last_day_logged')
        .eq('id', streakId)
        .single();

      if (data) {
        setStreak(data.streak);
        setLastLogged(data.last_day_logged); // Update the last logged date in state
      }
    }
    setLoading(false);
  };

  return (
    <div className='flex flex-col items-center p-6 border-2 border-gray-300 rounded w-4/5'>
      <h1>Progress: {streak}/90</h1>

      <Progressgrid streak={streak} />

      <Button 
        onClick={increment} 
        disabled={loading || alreadyUpdated} 
        className={alreadyUpdated ? "bg-gray-400 cursor-not-allowed" : ""}
      >
        {alreadyUpdated ? "Completed" : (loading ? "Updating..." : "Update Streak")}
      </Button>
    </div>
  );
};

export default Canvas;
