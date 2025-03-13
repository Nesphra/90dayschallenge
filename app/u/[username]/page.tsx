import { createClient } from '@/utils/supabase/server';
import Canvas from '@/components/canvas'
import Quote from '@/components/quote'
import { Open_Sans } from "next/font/google";
 
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"], // Adjust weight if needed
});


type Props = {
  params: Promise<{ username: string }>
}
 
export default async function Page({ params }: Props) {
  // Resolve the params promise to get the actual username
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const supabase = await createClient();
  
  // Fetch the user's profile based on the username from the URL
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, user_name')
    .eq('user_name', username)
    .single();

  const {data: streak } = await supabase
    .from('streaks')
    .select()
    .eq('id', profile?.id)
    .single()
  
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
      {/* Main Content - Takes up all remaining space */}
      <div className="flex-1 p-6 flex flex-col items-center text-center justify-between h-full gap-6">
        <div>
        <h1 className={`text-4xl font-bold ${openSans.className}`}>MY BRAIN</h1>
          <p>Every day is a massive win. Keep the goal in mind.</p>
        </div>
        <Canvas streak={streak.streak} streakId={streak.id} last_logged={streak.last_day_logged}/>
        <Quote/>
      </div>

      {/* Sidebar - Fixed Width */}
      <div className="p-4 w-[300px] items-center text-center bg-gray-200">
        <p>Community Component/</p>
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
 
