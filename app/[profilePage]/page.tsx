import { createClient } from '@/utils/supabase/server';
import UpdateStreakButton from "./updateStreakButton";

export default async function Instruments({
  params,
}: {
  params: { profilePage: string }
}) {
  const supabase = await createClient();
  // Remove the await here, profilePage is already a string
  const profilePage = params.profilePage;
  
  const { data: profileData } = await supabase
    .from("profiles")
    .select()
    .eq('user_name', profilePage)
    .single();

  if (!profileData) {
    return <div>User not found</div>
  }

  const targetUserId = profileData.id;

  const { data: streaks } = await supabase
    .from("streaks")
    .select()
    .eq('id', targetUserId)
    .single();

  const { data: profiles } = await supabase
    .from("profiles")
    .select()
    .eq('id', targetUserId)
    .single();

  return (
    <div>
      <h1>User Info:</h1>
      <p><strong>User ID:</strong> {targetUserId}</p>
      <p><strong>email:</strong> {profiles?.email}</p>
      <p><strong>User name:</strong> {profiles?.user_name}</p><br></br>
      <h1>Streak Data:</h1>
      {streaks ? (
        <div>
          <p><strong>Last Logged In:</strong> {streaks.last_day_logged}</p>
          <p><strong>Achieved Streaks:</strong> {streaks.achieved_streaks}</p>
          <p><strong>Current Streak:</strong> {streaks.streak} days</p>
          <UpdateStreakButton streakId={streaks.id} />
        </div>
      ) : (
        <p>No streak data found.</p>
      )}
    </div>
  )
}