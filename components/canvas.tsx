'use client'

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from './ui/button';
import Progressgrid from '@/components/progressGrid';
import { Pencil, RotateCcw } from "lucide-react";


type CanvasProps = {
  streakDate: string[];
  title: string;
  isUser: boolean;
  date_created: string;
};

const Canvas = ({ streakDate: initialStreakDate, title: initialTitle, isUser, date_created }: CanvasProps) => {
  const supabase = createClient();

  const [streakDate, setStreakDate] = useState<string[]>(initialStreakDate || []);
  const [dateCreated, setDateCreated] = useState<string>(date_created);
  const [loading, setLoading] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialTitle);
  const [newTitle, setNewTitle] = useState<string>(initialTitle);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

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
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

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
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error('Error updating title:', error.message);
      setTitle(previousTitle);
    }
  };

  const resetStreak = async () => {
    if (!isUser) return;
    setLoading(true);

    const updatedStreak = streakDate.slice(0, -1);

    const { error } = await supabase
      .from("streaks")
      .update({ streakDate: updatedStreak })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error("Error resetting streak:", error.message);
    } else {
      setStreakDate(updatedStreak);
    }

    setLoading(false);
  };

  const handleFullReset = async () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      // Reset confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingReset(false), 3000);
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const todayDate = getTodayUTC();

    const { error } = await supabase
      .from("streaks")
      .update({ 
        streakDate: [],
        date_created: todayDate 
      })
      .eq('user_id', user?.id);

    if (error) {
      console.error("Error resetting streak:", error.message);
    } else {
      setStreakDate([]);
      setDateCreated(todayDate);
      setIsConfirmingReset(false);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center p-10 justify-between border-2 border-gray-300 rounded w-4/5 md:min-w-[450px] h-[450px]">
      {isUser && (
        <Button
          onClick={handleFullReset}
          disabled={loading}
          className={`absolute top-2 left-2 ${
            isConfirmingReset 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
          size="sm"
        >
          {isConfirmingReset ? "Are you sure?" : "Reset"}
        </Button>
      )}

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
              <button
                onClick={() => setEditTitle(true)}
                className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition duration-200 w-0"
              >
                <Pencil size={17} />
              </button>
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
            disabled={loading || lastStreakDate !== today}
            className={`bg-red-500 peer ${lastStreakDate !== today ? "bg-gray-400 cursor-not-allowed" : ""}`}
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