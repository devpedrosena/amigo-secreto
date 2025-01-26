"use client"

import { login, LoginState } from "@/app/(auth)/login/action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useActionState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Loader, MessageCircle } from "lucide-react"

export default function LoginForm(){

    const [state, formAction, pending] = useActionState<LoginState, FormData>(
        login, 
        {
            sucess: null,
            message: ""
        }
    );

    return(
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Digite seu email para receber um link de login</CardDescription>
                <CardContent>
                    <form action={formAction}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email">email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    name="email"
                                    required
                                />

                            </div>

                            {state.sucess === true &&  (
                                <Alert className="text-muted-foreground">
                                    <MessageCircle className="h-4 w-4 !text-green-600"/>
                                    <AlertTitle className="text-gray-50">Email enviado!</AlertTitle>
                                    <AlertDescription>
                                        Confira seu inbox para acessar o link de login.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {state.sucess === false && (
                                <Alert className="text-muted-foreground">
                                    <MessageCircle className="h-4 w-4 !text-red-600" />
                                    <AlertTitle className="text-gray-50">Erro!</AlertTitle>
                                    <AlertDescription>
                                        Ocorreu um erro ao enviar link de login.
                                         Por favor entre em contato com o suporte!
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full">
                                {pending && <Loader className="animate-spin"/>}
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </CardHeader>
        </Card>
    )
}