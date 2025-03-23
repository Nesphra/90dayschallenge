"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Quote() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState<any>(null);
  const [streakLoaded, setStreakLoaded] = useState(false);

  useEffect(() => {
    const fetchStreak = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStreak(null);
        setStreakLoaded(true);
        return;
      }

      const { data: streaks, error } = await supabase
        .from("streaks")
        .select("title, quote, quoteLog, streakDate")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching streak data:", error);
        setStreakLoaded(true);
        return;
      }

      // Find the longest streak
      const longestStreak = streaks?.reduce((prev, current) => {
        return (prev?.streakDate?.length || 0) > (current?.streakDate?.length || 0) ? prev : current;
      }, { streakDate: [], title: '', quote: '', quoteLog: '' });

      setStreak(longestStreak);
      setStreakLoaded(true);

      // ✅ Convert local midnight to UTC to compare correctly
      const localMidnight = new Date();
      localMidnight.setHours(0, 0, 0, 0);
      const utcMidnight = localMidnight.toISOString().split("T")[0];

      if (longestStreak?.quoteLog !== utcMidnight) {
        generateNewQuote(longestStreak.title, utcMidnight);
      } else {
        setQuote(longestStreak.quote);
      }
    };

    fetchStreak();
  }, []);

  const generateNewQuote = async (title: string, todayUTC: string) => {
    setLoading(true);

    const prompts = [
      `Give me a **direct and powerful** motivational message that encourages me to achieve my goal: ${title}. Make it **actionable and inspiring**.`,
      `Show me **exactly how my life will improve** once I successfully achieve: ${title}. Keep it personal and vivid.`,
      `If I were about to **give up on** ${title}, how would a **great mentor** convince me to keep going?`,
      `What are **practical and immediate actions** I can take today to stay consistent with my goal: ${title}?`,
      `Give me a **motivational quote** that makes achieving ${title} feel **urgent, exciting, and rewarding**.`,
      `Describe the **mental and physical benefits** I will experience after achieving: ${title}. Make it **personal and powerful**.`,
      `What would a **world-class expert or coach** say to push me toward ${title} in the **most effective way possible**?`,
      `Imagine I am **writing a letter to my future self**, explaining why I must stay committed to: ${title}. What should I say? Do not start with "Dear future self" or anything like that.`,
      `Turn my goal: ${title} into a **hero's journey**, where I face challenges but ultimately succeed through perseverance.`,
      `If I were at a **crossroads**, choosing between quitting and pushing forward with ${title}, what would a **wise guide** tell me?`,
      `Give me a **straight-to-the-point, no-nonsense** piece of motivation that reminds me why ${title} is non-negotiable.`,
      `Provide a **deeply emotional yet logical** reason why I must prioritize: ${title} every single day.`,
      `Motivate me using **scientific and psychological principles** about why achieving ${title} is essential for my success.`,
      `Generate a **focused, high-impact** motivational quote for: ${title} in the style of **a great leader or philosopher** like Marcus Aurelius, Jocko Willink, or James Clear.`,
      `If I were **giving a speech to my past self**, warning them about the dangers of neglecting ${title}, what would I say?`,
      `Describe **the turning point in my life** when I finally commit to achieving ${title} once and for all. Make it feel like a movie moment.`,
      `Explain why achieving ${title} isn't just about me—but about how it impacts those around me. Make me **see the bigger picture**.`,
    ];

    const prompt =
      "Speak directly to *me* in second-person perspective, making sure it's clear that *I* am the one trying to achieve this goal. Your response should be **clear, personal, and motivational**—it should make sense even without knowing the original prompt. In a few sentences and without quotation marks: " +
      prompts[Math.floor(Math.random() * prompts.length)];

    console.log("Complete prompt:", prompt);

    try {
      const response = await fetch("/api/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();
      const newQuote =
        data.output ||
        "Failed to generate quote. Please wait a few minutes and try again.";
      setQuote(newQuote);

      // Save quote and date (in UTC) to Supabase
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

        await supabase
          .from("streaks")
          .update({ quote: newQuote, quoteLog: todayUTC })
          .eq("user_id", user?.id);
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
          loading ? (
            <p>Generating your daily motivation...</p>
          ) : (
            <div>
              <p className="my-2 text-md text-gray-500 font-bold">
                Daily Motivation:
              </p>
              <p>{quote}</p>
              <p className="h-0 opacity-50 text-xs m-2">
                generated by google gemini
              </p>
            </div>
          )
        ) : (
          <p>Please log in to see your motivation.</p>
        )
      ) : (
        <p>Loading daily motivation...</p>
      )}
    </div>
  );
}
