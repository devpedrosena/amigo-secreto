"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { use } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TextRevealCard, TextRevealCardTitle } from "@/components/ui/text-reveal-card"

import { LoadingSpinner } from "@/components/loading-spinner"

interface Participant {
  id: string
  group_id: string
  name: string
  email: string
  assigned_to: string
}

interface GroupData {
  id: string
  name: string
  owner_id: string
  participants: Participant[]
}

export default function GroupIdPage({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>
}) {
  const params = use(asyncParams)
  const groupId = params.id

  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [assignedUserName, setAssignedUserName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) throw new Error("User not authenticated")

        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("id, name, owner_id")
          .eq("id", groupId)
          .single()

        if (groupError) throw new Error("Erro ao carregar o grupo.")

        const { data: participantsData, error: participantsError } = await supabase
          .from("participants")
          .select("*")
          .eq("group_id", groupId)

        if (participantsError) throw new Error("Erro ao carregar os participantes.")

        const fullGroupData: GroupData = {
          ...groupData,
          participants: participantsData,
        }

        setGroupData(fullGroupData)

        // Find the current user's participant entry
        const currentParticipant = participantsData.find((p: Participant) => p.email === userData.user.email)

        if (currentParticipant) {
          // Find the assigned user's name from the participants data
          const assignedUser = participantsData.find((p: Participant) => p.id === currentParticipant.assigned_to)

          if (assignedUser) {
            setAssignedUserName(assignedUser.name)
          } else {
            setAssignedUserName("Não atribuído")
          }
        } else {
          setAssignedUserName("Usuário não encontrado no grupo")
        }

        setLoading(false)
      } catch (err) {
        console.error(err)
        setError(true)
        setLoading(false)
      }
    }

    fetchGroupData()
  }, [groupId, supabase])

  const handleDeleteGroup = async () => {
    const { error } = await supabase.from("groups").delete().eq("id", groupId)

    if (error) {
      toast({
        variant: "destructive",
        description: "Ocorreu um erro ao excluir o grupo.",
      })
    } else {
      toast({
        variant: "default",
        description: "Grupo excluído com sucesso.",
      })
      router.push("/app/grupos")
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <p>Erro ao carregar o grupo.</p>

  return (
    <main className="container mx-auto py-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Grupo{" "}
              <span className="font-light underline decoration-green-400">
                {groupData?.name}
              </span>
            </CardTitle>
            <Button onClick={handleDeleteGroup} variant="destructive">
              Excluir Grupo
            </Button>
          </div>
          <CardDescription>
            Informações do grupo e participantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Participantes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupData?.participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator className="my-6 " />
          <div className="flex items-center justify-center w-full">
            <TextRevealCard
              className="font-bold text-center sm:max-w-full sm:text-2xl"
              text="Passe o mouse para revelar"
              revealText={assignedUserName}
            >
              <TextRevealCardTitle>Seu amigo secreto</TextRevealCardTitle>
            </TextRevealCard>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

