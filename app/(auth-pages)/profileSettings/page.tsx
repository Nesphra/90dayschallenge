import { createClient } from '@/utils/supabase/server';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SaveButton from "./saveSettings";

const ChooseUsername = () => {
    return ( 
        <SaveButton>
            <Label htmlFor="username">Enter your username</Label>
            <Input name="username" placeholder="username" required />

            <Label htmlFor="firstName">First</Label>
            <Input name="firstname" placeholder="first name" required />

            <Label htmlFor="lastName">Last</Label>
            <Input name="lastname" placeholder="last name" required />
        </SaveButton>
    );
}

export default ChooseUsername;