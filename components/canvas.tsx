'use client'

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from './ui/button';
import Progressgrid from '@/components/progressGrid';
import { Pencil, RotateCcw } from "lucide-react";


type CanvasProps = {
  streakDate: string[];
  streakId: string;
  title: string;
  isUser: boolean;
  date_created: string;
};

const Canvas = ({ streakDate: initialStreakDate, streakId, title: initialTitle, isUser, date_created }: CanvasProps) => {
  const supabase = createClient();

  const [streakDate, setStreakDate] = useState<string[]>(initialStreakDate || []);
  const [dateCreated, setDateCreated] = useState<string>(date_created);
  const [loading, setLoading] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialTitle);
  const [newTitle, setNewTitle] = useState<string>(initialTitle);

  // Get today's date in UTC YYYY-MM-DD format
  const getTodayUTC = () => {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(now.getUTCDate()).padStart(2, '0');
    return `${utcYear}-${utcMonth}-${utcDay}`;
  };

  const today = getTodayUTC();
  const lastStreakDate = streakDate[streakDate.length - 1];
  const alreadyUpdated = lastStreakDate === today;

  const updateStreak = async () => {
    if (alreadyUpdated) return;
    setLoading(true);

    const updatedStreak = [...streakDate, today];

    const { error } = await supabase
      .from("streaks")
      .update({ streakDate: updatedStreak })
      .eq("id", streakId);

    if (error) {
      console.error("Error updating streak:", error.message);
    } else {
      setStreakDate(updatedStreak);
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

  const resetStreak = async () => {
    if (!isUser) return;
    setLoading(true);

    // Remove only the last date from the streak array
    const updatedStreak = streakDate.slice(0, -1);

    const { error } = await supabase
      .from("streaks")
      .update({ 
        streakDate: updatedStreak,
        // Removed date_created update since we want to keep the original start date
      })
      .eq("id", streakId);

    if (error) {
      console.error("Error resetting streak:", error.message);
    } else {
      setStreakDate(updatedStreak);
      // Removed setDateCreated since we're not changing it anymore
    }

    setLoading(false);
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
          <div className="flex items-center gap-2 group">
            <button onClick={() => setEditTitle(true)} className='h-20px capitalize cursor-pointer'>{title}</button>
            {isUser && (
              <div className="opacity-0 group-hover:opacity-50 transition duration-200 w-0">
                <Pencil size={17} />
              </div>
            )}
          </div>
        )}
      </div>

      <Progressgrid
        dateCreated={dateCreated}
        streakDates={streakDate}
        today={today}
        size={250}
        rounded={true}
        gap={0.25}
      />

      {isUser ? (
        <div className='flex gap-2'>
          <Button
            onClick={resetStreak}
            disabled={loading}
            className="bg-red-500 peer"
          >
            <div className="flex p-2 items-center [.peer:hover_&]:-rotate-180 transition-transform duration-500">
              <RotateCcw size={20} />
            </div>
          </Button>

          <Button
            onClick={updateStreak}
            disabled={loading || alreadyUpdated}
            className={alreadyUpdated ? "bg-gray-400 cursor-not-allowed" : ""}
          >
            {alreadyUpdated ? "Completed" : loading ? "Updating..." : "Update Streak"}
          </Button>
        </div>
      ) : (
        <Button className="bg-gray-400 cursor-not-allowed">
          {streakDate.length}/90 days complete
        </Button>
      )}
    </div>
  );
};

export default Canvas;
