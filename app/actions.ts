"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const addEmail = async (formData: FormData): Promise<void> => {
  const emailText = formData.get("email")?.toString();
  const supabase = await createClient();

  await supabase
    .from("email_list")
    .insert({ email: emailText });

  redirect('/thankyou'); 
};
