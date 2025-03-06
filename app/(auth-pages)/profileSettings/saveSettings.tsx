'use client'
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FormEvent, ReactNode } from 'react';

interface SaveButtonProps {
    children: ReactNode; // Accept children
}

const SaveButton = ({ children }: SaveButtonProps) => {
    const supabase = createClient();
    const router = useRouter();

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const firstName = form.firstname.value;
        const lastName = form.lastname.value;

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.error("User not found");
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                user_name: username,
                first_name: firstName,
                last_name: lastName
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error updating profile:", error.message);
        } else {
            console.log("Profile updated successfully!");
            router.push(`/${username}`);
        }
    }

    return (
        <form onSubmit={handleSave}>
            {children} {/* Render children here */}
            <button type="submit">Save settings</button>
        </form>
    );
};

export default SaveButton;