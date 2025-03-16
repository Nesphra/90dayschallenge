'use client';

import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';

export default function Quote() {
    const [quote, setQuote] = useState("");
    const [loading, setLoading] = useState(false);
    const [streak, setStreak] = useState<any>(null);
    const [streakLoaded, setStreakLoaded] = useState(false);

    useEffect(() => {
        const fetchStreak = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setStreak(null);
                setStreakLoaded(true);
                return;
            }

            const { data: streakData, error } = await supabase
                .from('streaks')
                .select('title, quote, quoteLog')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("Error fetching streak data:", error);
                setStreakLoaded(true);
                return;
            }

            setStreak(streakData);
            setStreakLoaded(true);

            // Check if a new quote is needed
            const today = new Date().toISOString().split('T')[0];
            if (streakData?.quoteLog !== today) {
                generateNewQuote(streakData.title, today);
            } else {
                setQuote(streakData.quote);
            }
        };

        fetchStreak();
    }, []);

    const generateNewQuote = async (title: string, today: string) => {
        setLoading(true);
        try {
            const response = await fetch("/api/generate-quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: `Give me a deeply moving motivational quote based on the goal: ${title}` }),
            });

            const data = await response.json();
            const newQuote = data.output || "Failed to generate quote.";
            setQuote(newQuote);

            // Save quote and date to Supabase
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser()

            await supabase
                .from('streaks')
                .update({ quote: newQuote, quoteLog: today })
                .eq('id', user?.id);
        } catch (error) {
            console.error("Error generating quote:", error);
            setQuote("Error fetching quote.");
        }
        setLoading(false);
    };

    return (
        <div>
            {streakLoaded ? (
                streak ? (
                    loading ? <p>Generating your daily quote...</p> : <p>{quote}</p>
                ) : (
                    <p>Please log in to see your quote.</p>
                )
            ) : (
                <p>Loading daily quote...</p>
            )}
        </div>
    );
}
