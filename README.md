# Amigo Secreto

Uma aplicação moderna de Amigo Secreto construída com Next.js e Supabase que permite aos usuários organizar sorteios de forma simples e segura.

## ✨ Funcionalidades

- **Autenticação sem Senha**: Login seguro via magic link usando Supabase
- **Envio de Emails**: Sistema de notificação usando Resend para login e comunicação com participantes
- **Componentes Modernos**: Construído com shadcn/ui para uma experiência de usuário elegante
- **Design Responsivo**: Layout totalmente adaptável usando Tailwind CSS
- **Tipagem Segura**: Desenvolvido com TypeScript para maior segurança no desenvolvimento

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) - Framework React para produção
- [Supabase](https://supabase.com/) - Backend e autenticação
- [Resend](https://resend.com/) - Serviço de envio de emails
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [TypeScript](https://www.typescriptlang.org/) - Verificação de tipos estática

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/devpedrosena/amigo-secreto.git
cd amigo-secreto
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

```env
POSTGRES_PASSWORD=sua_senha_postgres
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
NEXT_PUBLIC_URL=http://localhost:3000 # ou sua URL de produção
RESEND_API_KEY=sua_chave_api_resend
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

## 🔐 Fluxo de Autenticação

O app utiliza autenticação via magic link do Supabase:
1. Usuário insere seu email
2. Recebe um magic link via email (usando Resend)
3. Clica no link para autenticar
4. É redirecionado automaticamente de volta para o app

## 📧 Sistema de Emails

O aplicativo utiliza o Resend para:
- Envio de magic links para autenticação
- Notificações para os participantes do amigo secreto

## 🎨 Componentes de UI

O app utiliza componentes do shadcn/ui estilizados com Tailwind CSS. Principais componentes incluem:
- Formulários de autenticação
- Dashboard do usuário
- Interface de gerenciamento de grupos
- Formulários de preferências de presentes

## 📱 Veja em ação

![Preview do Projeto](https://drive.google.com/file/d/1Dt_xiU6GQnlX6BQDoP1uySzzJ5ymomlM/view)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [shadcn](https://github.com/shadcn) pelos incríveis componentes de UI
- Equipe Supabase pelo excelente sistema de autenticação
- Equipe Next.js pelo fantástico framework
- Equipe Resend pelo serviço de envio de emails
