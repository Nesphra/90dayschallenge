import { createClient } from '@/utils/supabase/server';
import type { Metadata, ResolvingMetadata } from 'next'
import User from '@/components/user'
import Other from '@/components/other'
import Friends from '@/components/friends'

type Props = {
  params: Promise<{ username: string }>
}
 
export default async function Page({ params }: Props) {
  // Resolve the params promise to get the actual username
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const supabase = await createClient();
  
  // get user data
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch the user's profile based on the username from the URL
  const { data: profile, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_name', username)
    .single();

  const isUser = profile?.id === user?.id;
  
  if (error || !profile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p>Sorry, we couldn't find a user with the username: {username}</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-0 w-full items-center h-full">
      {isUser ? (
        <User/>
      ) : (
        <Other profileName={username}/>
      )}
      
      <div className="p-4 w-full flex justify-center text-center bg-gray-200 rounded-xl h-full">
        <Friends></Friends>
      </div>
    </div>
  );
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Resolve the params promise to get the actual username
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const supabase = await createClient();

  // Fetch the user's profile based on the username from the URL
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_name')
    .eq('user_name', username)
    .single();

  // If no profile found, return default metadata
  if (!profile) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${profile.user_name}'s Streak`,
  };
}
