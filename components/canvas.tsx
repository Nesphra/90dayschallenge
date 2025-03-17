'use client'

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from './ui/button';
import Progressgrid from '@/components/progressGrid';
import { Pencil } from "lucide-react";

type CanvasProps = {
  streak: number;
  streakId: string;
  last_logged: string; // Stored in UTC
  title: string;
  isUser: boolean;
};

const Canvas = ({ streak: initialStreak, streakId, last_logged: initialLastLogged, title: initialTitle, isUser}: CanvasProps) => {
  const supabase = createClient();

  const [streak, setStreak] = useState<number>(initialStreak);
  const [lastLogged, setLastLogged] = useState<string>(initialLastLogged);
  const [loading, setLoading] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialTitle);
  const [newTitle, setNewTitle] = useState<string>(initialTitle);

  // Get today's date in UTC (converted from local)
  const localMidnight = new Date();
  localMidnight.setHours(0, 0, 0, 0); // Set time to 00:00 in local timezone
  const utcMidnight = localMidnight.toISOString().split("T")[0]; // Convert to YYYY-MM-DD UTC

  const lastLoggedDate = lastLogged ? lastLogged.split("T")[0] : null;
  const alreadyUpdated = lastLoggedDate === utcMidnight;
  
  const increment = async () => {
    if (alreadyUpdated) return;
    setLoading(true);

    // Store UTC midnight in Supabase
    const { error } = await supabase
      .from("streaks")
      .update({ streak: streak + 1, last_day_logged: utcMidnight })
      .eq("id", streakId);

    if (error) {
      console.error("Error updating streak:", error.message);
    } else {
      setStreak(streak + 1);
      setLastLogged(utcMidnight);
    }

    setLoading(false);
  };

  const saveTitle = async () => {
    setEditTitle(false);
    if (newTitle === title) return;

    const previousTitle = title;
    setTitle(newTitle);

    const { error } = await supabase
      .from("streaks")
      .update({ title: newTitle })
      .eq('id', streakId);

    if (error) {
      console.error('Error updating title:', error.message);
      setTitle(previousTitle);
    }
  };

  return (
    <div className="relative flex flex-col items-center p-10 justify-between border-2 border-gray-300 rounded w-4/5 h-[450px]">
      <div className="relative flex justify-center items-center gap-2 w-full">
        {editTitle ? (
          <input
            type="text"
            className="text-center bg-gray-200 px-2 w-1/2 outline-none h-20px m-0 p-0"
            value={newTitle}
            autoFocus
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
          />
        ) : (
          <h1 className='h-20px'>{title}</h1>
        )}
        {isUser ? (
          <button
            onClick={() => setEditTitle(true)}
            className="w-0 opacity-50 hover:opacity-100 transition duration-200"
          >
            <Pencil size={17} />
          </button>
        ) : (
          null
        )}
      </div>

      <Progressgrid streak={streak} size={6} rounded={true} gap={0.25}/>
      
      {isUser ? (
        <Button
          onClick={increment}
          disabled={loading || alreadyUpdated}
          className={alreadyUpdated ? "bg-gray-400 cursor-not-allowed" : ""}
        >
          {alreadyUpdated ? "Completed" : loading ? "Updating..." : "Update Streak"}
        </Button>
      ) : (
        <Button
          className={"bg-gray-400 cursor-not-allowed"}
        >
          {streak}/90 days complete
        </Button>
      )}
    </div>
  );
};

export default Canvas;
