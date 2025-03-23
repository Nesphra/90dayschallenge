import { createClient } from '@/utils/supabase/server';
import { Open_Sans } from "next/font/google";
import Canvas from '@/components/canvas';

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

type OtherProps = {
  profileName: string;
};

const Other = async ({ profileName }: OtherProps) => {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_name', profileName)
        .single();

    if (!profile) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">User not found</h1>
                <p>Sorry, we couldn't find a user with the username: {profileName}</p>
            </div>
        );
    }

    // Fetch all streaks for the viewed user
    const { data: streaks } = await supabase
        .from('streaks')
        .select()
        .eq('user_id', profile.id);

    return (
        <div className="flex-1 p-6 flex flex-col items-center text-center justify-between h-full gap-6">
            <div>
                <h1 className={`text-4xl font-bold uppercase ${openSans.className}`}>{profileName}'s BRAIN</h1>
                <p><span className='capitalize text-blue-400'>{profileName}</span> is leading the chase.</p>
            </div>
            {streaks?.map((streak) => (
                <Canvas
                    key={streak.streak_id}
                    isUser={false}
                    streakDate={streak.streakDate || []}
                    userID={profile.id}
                    title={streak.title}
                    date_created={streak.date_created}
                    streakID={streak.streak_id}
                />
            ))}
            <p>{streaks?.[0]?.quote}</p>
        </div>
    );
};

export default Other;
