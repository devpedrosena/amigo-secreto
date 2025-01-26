import NewGroupForm from "@/components/NewGroupForm"
import { createClient } from "@/utils/supabase/server"

export default async function NewGroupPage() {

    const supabase = await createClient()
    const {data} = await supabase.auth.getUser()

    const loggedUser = {
        id: data.user?.id as string,
        email: data.user?.email as string,
    }

    return(
        <div className="my-10">
            <NewGroupForm loggedUser={loggedUser} />
        </div>
    )
}