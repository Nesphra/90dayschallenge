"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const addEmail = async (formData: FormData): Promise<void> => {
  const emailText = formData.get("email")?.toString();

  // Simple email format validation
  const isValidEmail = emailText && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText);

  if (!isValidEmail) {
    // Optional: redirect back with error params or handle error differently
    redirect("/?message=Invalid+email+format");
  }

  const supabase = await createClient();

  await supabase
    .from("email_list")
    .insert({ email: emailText });

  redirect("/thankyou");
};
