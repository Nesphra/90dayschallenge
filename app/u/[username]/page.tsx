import { createClient } from '@/utils/supabase/server';
 
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
  
  if (error || !profile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p>Sorry, we couldn't find a user with the username: {username}</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <div className="mt-4">
        <p><strong>User ID:</strong> {profile.id}</p>
        <p><strong>Username:</strong> {profile.user_name}</p>
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
 

// ------------------------------------

// export default async function profilePage({
//   params,
// }: {
//   params: { profilePage: string }
// }) {
//   const supabase = await createClient();
//   const profilePage = await params.profilePage
  
//   const { data: profileData } = await supabase
//     .from("profiles")
//     .select()
//     .eq('user_name', profilePage)
//     .single();

//   if (!profileData) {
//     return <div>User not found</div>
//   }

//   const targetUserId = profileData.id;

//   const { data: streaks } = await supabase
//     .from("streaks")
//     .select()
//     .eq('id', targetUserId)
//     .single();

//   const { data: profiles } = await supabase
//     .from("profiles")
//     .select()
//     .eq('id', targetUserId)
//     .single();

//   return (
//     <div>
//       <h1>User Info:</h1>
//       <p><strong>User ID:</strong> {targetUserId}</p>
//       <p><strong>email:</strong> {profiles?.email}</p>
//       <p><strong>User name:</strong> {profiles?.user_name}</p><br></br>
//       <h1>Streak Data:</h1>
//       {streaks ? (
//         <div>
//           <p><strong>Last Logged In:</strong> {streaks.last_day_logged}</p>
//           <p><strong>Achieved Streaks:</strong> {streaks.achieved_streaks}</p>
//           <p><strong>Current Streak:</strong> {streaks.streak} days</p>
//           <UpdateStreakButton streakId={streaks.id} />
//         </div>
//       ) : (
//         <p>No streak data found.</p>
//       )}
//     </div>
//   )
// }
