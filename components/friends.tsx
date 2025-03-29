"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from './ui/button';

type UserProfile = {
  user_name: string;
  id: string;
  streakLength?: number;
  title?: string;
};

const Friends = () => {
    const [friends, setFriends] = useState<{ username: string; streakLength: number; title?: string }[]>([]);
    const [communityUsers, setCommunityUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [communityLoading, setCommunityLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [friendUsername, setFriendUsername] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const USERS_PER_PAGE = 10;
    
    const supabase = createClient();

    useEffect(() => {
        fetchFriends();
        fetchCommunityUsers();
    }, []);

    const fetchFriends = async () => {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error("Error fetching user:", userError.message);
            setError("Failed to fetch user.");
            setLoading(false);
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select("friends")
            .eq('id', user?.id)
            .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            setError("Failed to load friends.");
            setLoading(false);
            return;
        }

        const friendUsernames = profile?.friends || [];

        const friendsWithStreaks = await Promise.all(friendUsernames.map(async (username: string) => {
            const { data: friendProfile, error: friendProfileError } = await supabase
                .from('profiles')
                .select("id")
                .eq('user_name', username)
                .single();

            if (friendProfileError || !friendProfile) {
                console.error(`Error fetching ID for ${username}:`, friendProfileError?.message);
                return { username, streakLength: 0 };
            }

            const { data: streakData } = await supabase
                .from('streaks')
                .select("streakDate, title")
                .eq('user_id', friendProfile.id)
                .single();

            return {
                username,
                streakLength: streakData?.streakDate?.length || 0, // ✅ Use streakDate length
                title: streakData?.title,
            };
        }));

        setFriends(friendsWithStreaks);
        setLoading(false);
    };

    const fetchCommunityUsers = async (nextPage = 0) => {
        setCommunityLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            setCommunityLoading(false);
            return;
        }

        // Get current user's friends list
        const { data: profile } = await supabase
            .from('profiles')
            .select("friends")
            .eq('id', user.id)
            .single();

        const friendsList = profile?.friends || [];

        // Fetch users who aren't friends, excluding the current user
        const { data: users, error } = await supabase
            .from('profiles')
            .select('user_name, id')
            .not('user_name', 'in', `(${friendsList.join(',')})`)
            .neq('id', user.id)
            .range(nextPage * USERS_PER_PAGE, (nextPage + 1) * USERS_PER_PAGE - 1)
            .order('user_name');

        if (error) {
            console.error("Error fetching community users:", error);
            setCommunityLoading(false);
            return;
        }

        // Fetch streak data for each user
        const usersWithStreaks = await Promise.all(users.map(async (user) => {
            const { data: streakData } = await supabase
                .from('streaks')
                .select('streakDate, title')
                .eq('user_id', user.id)
                .single();

            return {
                ...user,
                streakLength: streakData?.streakDate?.length || 0,
                title: streakData?.title
            };
        }));

        setCommunityUsers(prevUsers => 
            nextPage === 0 ? usersWithStreaks : [...prevUsers, ...usersWithStreaks]
        );
        setHasMore(users.length === USERS_PER_PAGE);
        setCommunityLoading(false);
    };

    const loadMoreUsers = () => {
        setPage(prev => prev + 1);
        fetchCommunityUsers(page + 1);
    };

    const addFriendFromCommunity = async (username: string) => {
        setError(null);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: profile } = await supabase
            .from('profiles')
            .select("friends")
            .eq('id', user.id)
            .single();

        const currentFriends = profile?.friends || [];
        const updatedFriends = [...currentFriends, username];

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ friends: updatedFriends })
            .eq('id', user.id);

        if (updateError) {
            setError("Failed to add friend.");
            return;
        }

        // Remove user from community list and add to friends list
        setCommunityUsers(prev => prev.filter(u => u.user_name !== username));
        fetchFriends(); // Refresh friends list
    };

    const handleAddFriend = async () => {
        if (!friendUsername.trim()) return;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Error fetching user:", userError?.message);
            setError("Failed to fetch user.");
            return;
        }

        const { data: friendProfile, error: friendProfileError } = await supabase
            .from('profiles')
            .select("id")
            .eq('user_name', friendUsername)
            .single();

        if (friendProfileError || !friendProfile) {
            setError("User not found.");
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select("friends")
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            setError("Failed to load friends.");
            return;
        }

        const currentFriends = profile?.friends || [];

        if (currentFriends.includes(friendUsername)) {
            setError("Friend already added.");
            return;
        }

        const updatedFriends = [...currentFriends, friendUsername];
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ friends: updatedFriends })
            .eq('id', user.id);

        if (updateError) {
            console.error("Error updating friends list:", updateError.message);
            setError("Failed to add friend.");
            return;
        }

        setFriendUsername(""); 
        fetchFriends(); 
    };

    const handleRemoveFriend = async (friendUsername: string) => {
        setError(null); // Reset error state
    
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Error fetching user:", userError?.message);
            setError("Failed to fetch user.");
            return;
        }
    
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select("friends")
            .eq('id', user.id)
            .single();
    
        if (profileError || !profile) {
            console.error("Error fetching profile:", profileError?.message);
            setError("Failed to load friends.");
            return;
        }
    
        const currentFriends = profile?.friends || [];
        if (!currentFriends.includes(friendUsername)) {
            setError("Friend not found in your list.");
            return;
        }
    
        const updatedFriends = currentFriends.filter((friend: string) => friend !== friendUsername);
    
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ friends: updatedFriends })
            .eq('id', user.id);
    
        if (updateError) {
            console.error("Error updating friends list:", updateError.message);
            setError("Failed to remove friend.");
            return;
        }
    
        fetchFriends(); // Refresh the friend list after removal
    };
    
    return (
        <div className="flex-col w-full max-w-[400px]"> {/*friends, only friends*/}
            <div>
                <h2 className='font-bold'>FRIENDS</h2>
                <div className="flex gap-2 p-2">
                    <input 
                        className="px-2 py-1 rounded text-[13px] flex-1" 
                        placeholder="Add a friend by username"
                        value={friendUsername}
                        onChange={(e) => setFriendUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                    />

                    <button 
                        className="px-3 py-1 bg-gray-500 text-white rounded text-[13px]"
                        onClick={handleAddFriend}
                    >
                        <UserPlus size={15}></UserPlus>
                    </button>
                </div>

                {error && <div className="text-red-500 px-2">{error}</div>}

                <div className="overflow-y-auto flex-1 p-2">
                    {loading ? (
                        <div className="text-gray-600">Loading...</div>
                    ) : friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <div key={index} className="p-2 border-b relative hover:drop-shadow-lg duration-200">
                                <a href={`/u/${friend.username}`}>
                                    <div className='bg-white p-2 rounded-xl flex flex-col justify-center items-center'>
                                        <p className="text-md font-semibold">{friend.username}</p>
                                        <div>
                                            <p className='text-sm'>{friend.title}</p>
                                            <p className="text-gray-600 text-[13px] opacity-70">
                                                {friend.streakLength}/90
                                            </p>
                                        </div>
                                    </div>
                                </a>
                                <button onClick={() => handleRemoveFriend(friend.username)} className='top-5 right-5 absolute hover:bg-red-500'>
                                    <Trash2 size={18}></Trash2>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-gray-600">No friends added yet.</div>
                    )}
                </div>
            </div>
            <div className="mt-6"> {/*community section*/}
                <h2 className='font-bold'>COMMUNITY</h2>
                <div className="overflow-y-auto flex-1 p-2">
                    {communityLoading && page === 0 ? (
                        <div className="text-gray-600">Loading community...</div>
                    ) : communityUsers.length > 0 ? (
                        <>
                            {communityUsers.map((user, index) => (
                                <div key={index} className="p-2 border-b relative hover:drop-shadow-lg duration-200">
                                    <a href={`/u/${user.user_name}`}>
                                        <div className='bg-white p-2 rounded-xl flex flex-col justify-center items-center'>
                                            <p className="text-md font-semibold">{user.user_name}</p>
                                            <div>
                                                <p className='text-sm'>{user.title}</p>
                                                <p className="text-gray-600 text-[13px] opacity-70">
                                                    {user.streakLength}/90
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                    <button 
                                        onClick={() => addFriendFromCommunity(user.user_name)}
                                        className='top-5 right-5 absolute hover:bg-green-500'
                                    >
                                        <UserPlus size={18} />
                                    </button>
                                </div>
                            ))}
                            {hasMore && (
                                <Button 
                                    onClick={loadMoreUsers}
                                    disabled={communityLoading}
                                    className="w-full mt-4"
                                >
                                    {communityLoading ? "Loading..." : "Load More"}
                                </Button>
                            )}
                        </>
                    ) : (
                        <div className="p-4 text-gray-600">No other users found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Friends;
