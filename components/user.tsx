import { createClient } from '@/utils/supabase/server';
import { Open_Sans } from "next/font/google";
import Canvas from '@/components/canvas';
import Quote from '@/components/quote';

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"], // Adjust weight if needed
});

const User = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()

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
                    isUser={true}
                    streakId={streak.id}
                    title={streak.title}
                    date_created={streak.date_created}
                    streakDate={streak.streakDate || []} // Ensure it's always an array
                />
            )}
            <Quote />
        </div>
    );
};

export default User;
