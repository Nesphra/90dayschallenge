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
 
