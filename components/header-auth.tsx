import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileData } = await supabase
    .from("profiles")
    .select()
    .eq('id', user?.id)
    .single();

  return user ? (
    <div className="flex items-center gap-6">
      <div className="linkList">
        <ul className="flex space-x-8">
          <li>
            <a className="relative text-black hover:text-blue-800 group" href={"/u/" + (profileData?.user_name ?? "null")}>
              My Brain
              <span className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-blue-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          </li>
        </ul>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Register</Link>
      </Button>
    </div>
  );
}
