import { Button } from "@/components/ui/button";
import { Search, UserPlus, Trash2 } from "lucide-react";

export default async function Home() {
  return (
    <>
      <main className="">
        <div className="">
          <h1 className="">Take control.</h1>
          <p>Join million of others improving their lives</p>
          <Button><a href="/sign-up">Change my life</a></Button>
        </div>
      </main>
    </>
  );
}
