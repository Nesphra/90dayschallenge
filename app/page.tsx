import { addEmail } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div>
        <form className="flex flex-col min-w-64 max-w-64 mx-auto">
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <h1>Email</h1>
            <Input name="email" placeholder="you@email.com" required />
            <SubmitButton formAction={addEmail} pendingText="Adding email...">
              Add email
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
        <p className="text-xs opacity-50">By submitting, you accept to receive an e-mail upon publishing of the website.</p>
      </div>
    </>
  );
}