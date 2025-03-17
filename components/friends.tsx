"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import ProgressGrid from './progressGrid';
import { Search, UserPlus, Trash2 } from "lucide-react";

const Friends = () => {
    const [friends, setFriends] = useState<{ username: string; streak: number | null; title?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [friendUsername, setFriendUsername] = useState(""); 
    const supabase = createClient(); 

    useEffect(() => {
        fetchFriends();
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
                return { username, streak: null };
            }

            const { data: streakData } = await supabase
                .from('streaks')
                .select()
                .eq('id', friendProfile.id)
                .single();

            return { username, streak: streakData.streak, title: streakData.title };
        }));

        setFriends(friendsWithStreaks);
        setLoading(false);
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

    // to do
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
    
        // Remove the friend from the array
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
        <div className="flex flex-col h-full max-h-full min-h-0 justify-center">
            <div className="flex gap-2 p-2">
                <input 
                    className="px-2 py-1 rounded text-[13px] flex-1" 
                    placeholder="Add a friend by username"
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                />
                <button 
                    className="px-3 py-1 bg-gray-500 text-white rounded text-[13px]"
                    onClick={handleAddFriend}
                >
                    <UserPlus size={15}></UserPlus>
                </button>
            </div>

            {error && <div className="text-red-500 px-2">{error}</div>}

            <div className="flex-1 overflow-y-auto p-2 max-h-[650px]">
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
                                            {friend.streak}/90
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
    );
};

export default Friends;
