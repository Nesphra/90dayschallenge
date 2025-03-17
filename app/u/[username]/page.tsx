import { createClient } from '@/utils/supabase/server';
import User from '@/components/user';
import Other from '@/components/other';
import Friends from '@/components/friends';
import type { Metadata } from 'next';

type Props = {
  params: { username: string };
};

export default async function Page({ params }: Props) {
  const { username } = params;
  const supabase = await createClient();

  // Get current authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the user's profile based on the username from the URL
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, user_name')
    .eq('user_name', username)
    .single();

  if (error || !profile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p>Sorry, we couldn't find a user with the username: {username}</p>
      </div>
    );
  }

  const isUser = profile.id === user?.id;

  return (
    <div className="flex h-full">
      {isUser ? <User /> : <Other profileName={username} />}
      <div className="p-4 w-[300px] items-center text-center bg-gray-200 rounded-xl">
        <Friends />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params;
  const supabase = await createClient();

  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the user's profile based on the username
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, user_name')
    .eq('user_name', username)
    .single();
  
  const { data: streak } = await supabase
    .from('streaks')
    .select('streak')
    .eq('id', user?.id)
    .single()

  if (!profile) {
    return { title: 'User Not Found' };
  }

  const isUser = profile.id === user?.id;

  return {
    title: isUser ? `My Streak - ${streak?.streak}/90` : `${profile.user_name}'s Streak`,
  };
}
