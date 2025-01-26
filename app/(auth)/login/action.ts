'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export type LoginState = {
    sucess: null | boolean;
    message?: string;
}

export async function login(previousState:LoginState, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
        }
    })

    if (error) {
        return{
            sucess: false,
            message: error.message,
        }
    }

    return{
        sucess: true,
        message: "Email enviado"
    }
}