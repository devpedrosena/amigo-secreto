import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AppLayout ({
    children
}:
    {
        children: React.ReactNode
    }
){
    
    const supabase = await createClient()

    const {data, error} = await supabase.auth.getUser()

    if(error || !data?.user){
        redirect('/login')
    }

    return(
        <div>
            <Header/>
            {children}
            <Toaster />
            <Footer/>
        </div>
    )
    
}