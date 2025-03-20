import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase =  await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  
  if (user) {
    const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
    
    if (profile?.username) {
      redirect(`/u/${profile.username}`); // Redirect if user is authenticated
    }
  }
  
  return (
    <main>
      <div>
        <h1>Take control.</h1>
        <p>Join millions of others improving their lives</p>
        <Button><a href="/sign-up">Change my life</a></Button>
        <p>{}</p>
      </div>
    </main>
  );
}
