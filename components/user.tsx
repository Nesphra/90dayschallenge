import { createClient } from '@/utils/supabase/server';
import { Open_Sans } from "next/font/google";
import Canvas from '@/components/canvas';
import Quote from '@/components/quote';

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"], // Adjust weight if needed
});

// ✅ Correct async arrow function export
const User = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()

    // const { data: profile } = await supabase
    //     .from('profiles')
    //     .select()
    //     .eq('id', user?.id)
    //     .single()

    const { data: streak } = await supabase
        .from('streaks')
        .select()
        .eq('id', user?.id)
        .single()

    return (
        <div className="flex-1 p-6 flex flex-col items-center text-center justify-between h-full gap-6">
        <div>
            <h1 className={`text-4xl font-bold ${openSans.className}`}>MY BRAIN</h1>
            <p>Every day is a massive win. Keep the goal in mind.</p>
        </div>
        {streak && (
            <Canvas
            isUser = {true}
            streak={streak.streak}
            streakId={streak.id}
            last_logged={streak.last_day_logged}
            title={streak.title}
            />
        )}
        <Quote />
        </div>
    );
};

export default User;
