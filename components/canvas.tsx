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

  // Get today's date in YYYY-MM-DD format in the user's local timezone
  const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert dates to consistent format in local timezone
  const normalizeDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const processedStreakDates = streakDate.map(normalizeDate);
  const processedDateCreated = normalizeDate(date_created);
  const today = getTodayLocal();

  const alreadyUpdated = processedStreakDates.includes(today);

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

    const today = getTodayLocal();

    const { error } = await supabase
      .from("streaks")
      .update({ 
        streakDate: [], 
        date_created: today 
      })
      .eq("id", streakId);

    if (error) {
      console.error("Error resetting streak:", error.message);
    } else {
      setStreakDate([]);
      setDateCreated(today);
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
          <h1 className='h-20px'>{title}</h1>
        )}
        {isUser && (
          <button
            onClick={() => setEditTitle(true)}
            className="w-0 opacity-50 hover:opacity-100 transition duration-200"
          >
            <Pencil size={17} />
          </button>
        )}
      </div>

      <Progressgrid
        dateCreated={processedDateCreated}
        streakDates={processedStreakDates} // Use corrected streak dates
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
