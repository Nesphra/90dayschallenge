import { createClient } from '@/utils/supabase/server';
import UpdateStreakButton from "../../../components/updateStreakButton";
// import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
}
 
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
 
export default function Page({ params }: Props) {
  
  return (
    <div>
      hello there
    </div>
  )
}

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
