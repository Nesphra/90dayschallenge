import { createClient } from '@/utils/supabase/server';
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
    <div className="flex h-full">
      {isUser ? (
        <User/>
      ) : (
        <Other profileName={username}/>
      )}
      
      <div className="p-4 w-[300px] items-center text-center bg-gray-200 rounded-xl">
        <Friends></Friends>
      </div>
    </div>
  );
}

// import type { Metadata, ResolvingMetadata } from 'next'
 
// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // read route params
//   const { id } = await params
 
//   // fetch data
//   const product = await fetch(`https://.../${id}`).then((res) => res.json())
 
//   // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || []
 
//   return {
//     title: product.title,
//     openGraph: {
//       images: ['/some-specific-page-image.jpg', ...previousImages],
//     },
//   }
// }
 
