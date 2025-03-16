import { createClient } from '@/utils/supabase/server';
import { Open_Sans } from "next/font/google";
import Canvas from '@/components/canvas';

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

// ✅ Use correct PascalCase naming
type OtherProps = {
  profileName: string;
};

// ✅ Correct async function and prop handling
const Other = async ({ profileName }: OtherProps) => {
    const supabase = await createClient();

    // Fetch the profile of the user being viewed
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_name', profileName)
        .single();

    const { data: streaks } = await supabase
        .from('streaks')
        .select()
        .eq('id', profile?.id)
        .single()

    if (!profile) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">User not found</h1>
                <p>Sorry, we couldn't find a user with the username: {profileName}</p>
            </div>
        );
    }

    // Fetch the streak data for the viewed user
    const { data: streak } = await supabase
        .from('streaks')
        .select()
        .eq('id', profile.id)
        .single();

    return (
        <div className="flex-1 p-6 flex flex-col items-center text-center justify-between h-full gap-6">
            <div>
                <h1 className={`text-4xl font-bold uppercase ${openSans.className}`}>{profileName}'s BRAIN</h1>
                <p><span className='capitalize text-blue-400'>{profileName}</span> is leading the chase.</p>
            </div>
            {streak && (
                <Canvas
                    isUser={false}
                    streak={streak.streak}
                    streakId={streak.id}
                    last_logged={streak.last_day_logged}
                    title={streak.title}
                />
            )}
            <p>{streak.quote}</p>
        </div>
    );
};

export default Other;
