"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader, Mail, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { createGroup, createGroupState } from "@/app/app/grupos/novo/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Participant {
  name: string;
  email: string;
}

export default function NewGroupForm({
  loggedUser,
}: {
  loggedUser: { email: string; id: string };
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: loggedUser.email },
  ]);

  const [groupName, setGroupName] = useState("");

  const [state, formAction, pending] = useActionState<
    createGroupState,
    FormData
  >(createGroup, {
    sucess: null,
    message: "",
  });

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string
  ) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const addParticipant = () => {
    setParticipants(participants.concat({ name: "", email: "" }));
  };

  useEffect(() => {
    if (state.sucess === false) {
      toast({
        variant: "destructive",
        description: state.message,
      });
    } else if (state.sucess === true) {
      toast({
        variant: "default",
        description: state.message,
      });
      if (state.groupId) {
        router.push(`/app/grupos/${state.groupId}`); // Redireciona após criação do grupo
      }
    }
  }, [state, toast, router]);

  // Verifica se há mais de 1 participante
  const isSubmitDisabled =
    participants.length <= 1 ||
    groupName.trim() === "" ||
    participants[0].name === "";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Grupo</CardTitle>
        <CardDescription>Convide seus amigos para participar</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name"> Nome do grupo</Label>
            <Input
              id="group-name"
              name="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Digite o nome do grupo"
            />
          </div>
          <h2 className="!mt-12">Participantes</h2>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-end space-y-4 md:space-x-4"
            >
              <div className="flex-grow space-y-2 w-full">
                <Label htmlFor={`name-${index}`}>Nome</Label>
                <Input
                  id={`name-${index}`}
                  name="name"
                  value={participant.name}
                  onChange={(e) =>
                    updateParticipant(index, "name", e.target.value)
                  }
                  placeholder="Digite o nome da pessoa"
                  required
                />
              </div>
              <div className="flex-grow space-y-2 w-full">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  name="email"
                  type="email"
                  value={participant.email}
                  onChange={(e) =>
                    updateParticipant(index, "email", e.target.value)
                  }
                  placeholder="Digite o email da pessoa"
                  className="read-only:text-muted-foreground"
                  required
                  readOnly={participant.email === loggedUser.email}
                />
              </div>
              <div className="min-w-9">
                {participants.length > 1 &&
                  participant.email !== loggedUser.email && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeParticipant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={addParticipant}
            className="w-full md:w-auto"
          >
            Adicionar amigo
          </Button>

          <Button
            type="submit"
            className="flex items-center space-x-2 w-full md:w-auto"
            disabled={isSubmitDisabled} // Desabilita o botão se não houver mais de 1 participante
          >
            <Mail className="w-3 h-3" /> Criar grupo e enviar emails
            {pending && <Loader className="animate-spin" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
