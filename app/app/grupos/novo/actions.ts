"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

// Definição do estado para criação de grupo
export type createGroupState = {
  sucess: null | boolean;
  message: string;
  groupId?: string; // Adicionamos a propriedade para retornar o ID do grupo
};

type Participant = {
  id: string;
  group_id: string;
  name: string;
  email: string;
  assigned_to: string | null;
  created_at: string;
};

// Função de sorteio de participantes
function drawGroup(participants: Participant[]): Participant[] {
  const selectedParticipants: string[] = [];

  return participants.map((participant) => {
    const availableParticipants = participants.filter(
      (p) => p.id !== participant.id && !selectedParticipants.includes(p.id)
    );

    if (availableParticipants.length === 0) {
      throw new Error(
        "Erro ao sortear participantes. Verifique se o número de participantes é suficiente."
      );
    }

    const assignedParticipant =
      availableParticipants[
        Math.floor(Math.random() * availableParticipants.length)
      ];

    selectedParticipants.push(assignedParticipant.id);

    return {
      ...participant,
      assigned_to: assignedParticipant.id,
    };
  });
}

// Função para enviar e-mails aos participantes
async function sendEmailToParticipants(
  participants: Participant[],
  groupName: string
): Promise<{ error: string | null }> {
  if (!process.env.RESEND_API_KEY) {
    return { error: "API Key do Resend não configurada." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await Promise.all(
      participants.map((participant) =>
        resend.emails.send({
          from: "send@amigos.pedrosena.tech",
          to: participant.email,
          subject: `Sorteio de amigo secreto - ${groupName}`,
          html: `<p>Você está participando do amigo secreto do grupo "${groupName}".<br/><br/>
                 O seu amigo secreto é: <strong>${
                   participants.find((p) => p.id === participant.assigned_to)
                     ?.name
                 }</strong></p>`,
        })
      )
    );
    return { error: null };
  } catch (err) {
    console.error("Erro ao enviar e-mails:", err);
    return { error: "Ocorreu um erro ao enviar os e-mails." };
  }
}

// Função principal para criar o grupo
export async function createGroup(
  _previousState: createGroupState,
  FormData: FormData
): Promise<createGroupState> {
  const supabase = await createClient();

  // Obter o usuário autenticado
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser.user) {
    return {
      sucess: false,
      message: "Erro ao autenticar. Por favor, faça login novamente.",
    };
  }

  // Obter os dados do formulário
  const names = FormData.getAll("name") as string[];
  const emails = FormData.getAll("email") as string[];
  const groupName = FormData.get("group-name") as string;

  if (!groupName) {
    return {
      sucess: false,
      message: "O nome do grupo é obrigatório.",
    };
  }

  // Criar o grupo no Supabase
  const { data: newGroup, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: groupName,
      owner_id: authUser.user.id,
    })
    .select()
    .single();

  if (groupError || !newGroup) {
    return {
      sucess: false,
      message:
        "Ocorreu um erro ao criar o grupo. Por favor, tente novamente mais tarde.",
    };
  }

  // Adicionar participantes ao grupo
  const participants = names.map((name, index) => ({
    name,
    email: emails[index],
    group_id: newGroup.id,
  }));

  const { data: createdParticipants, error: participantsError } = await supabase
    .from("participants")
    .insert(participants)
    .select();

  if (participantsError || !createdParticipants) {
    return {
      sucess: false,
      message:
        "O grupo foi criado, mas ocorreu um erro ao adicionar os participantes.",
    };
  }

  try {
    console.log("Sorteando participantes...");
    const drawnParticipants = drawGroup(createdParticipants);

    console.log("Atualizando participantes sorteados...");
    const { error: errorDraw } = await supabase
      .from("participants")
      .upsert(drawnParticipants);

    if (errorDraw) {
      console.error("Erro ao sortear e atualizar participantes:", errorDraw);
      return {
        sucess: false,
        message:
          "O grupo foi criado, mas ocorreu um erro ao sortear os participantes.",
      };
    }

    console.log("Enviando e-mails aos participantes...");
    const { error: errorResend } = await sendEmailToParticipants(
      drawnParticipants,
      groupName
    );

    if (errorResend) {
      console.error("Erro ao enviar e-mails:", errorResend);
      return {
        sucess: false,
        message: errorResend,
      };
    }

    // Retorna o ID do grupo para ser usado no redirecionamento no cliente
    return {
      sucess: true,
      message: "Grupo criado com sucesso! Redirecionando...",
      groupId: newGroup.id, // Retorna o ID do grupo para redirecionamento
    };
  } catch (error) {
    console.error("Erro ao processar o grupo:", error);
    return {
      sucess: false,
      message:
        "O grupo foi criado, mas ocorreu um erro durante o processamento.",
    };
  }
}
