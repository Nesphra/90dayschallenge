import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <main className="w-100 bg-blue-200">
        <div className="w-100 bg-red-500 flex-col justify-content items-center h-100 mr-5">
          <h1 className="font-medium text-xl mb-4">Take control.</h1>
          <p>Join million of others improving their lives</p>
          <Button>Change my life</Button>
        </div>
      </main>
    </>
  );
}
