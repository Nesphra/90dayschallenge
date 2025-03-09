'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const ChooseUsername = () => {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        
        const { error } = await supabase
            .from('profiles')
            .update({
                user_name: data.username,
            })
            .eq('id', user.id);

        if (!error) {
            router.push(`/${data.username}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="username">Enter your username</Label>
            <Input name="username" placeholder="username" required />
    
            <button type="submit">Save your settings</button>
        </form>
    );
}

export default ChooseUsername;