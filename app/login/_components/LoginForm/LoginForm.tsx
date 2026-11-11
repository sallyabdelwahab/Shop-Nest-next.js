"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {signIn} from 'next-auth/react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"


const formSchema = z.object({
  email: z.string()
    .nonempty("Email is required")
    .email("Invalid email format"),

  password: z.string().min(1, "Password is required")
})

type FormField = z.infer<typeof formSchema>

export function LoginForm() {
    const [isLoading,setIsLoading]=useState<boolean>(false)
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get('callback-url') || "/";
    const [error, setError] = useState("");



  const form = useForm<FormField>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

 async function onSubmit(values: FormField) {
    setIsLoading(true);
    setError("");
    try {
      const response = await signIn("credentials", {
        callbackUrl,
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (!response?.ok) {
        setError("The email or password is incorrect. Please try again.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
   <Card className="w-full max-w-md p-6 sm:p-9">
 <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="cursor-pointer w-full"> {isLoading && <Loader2 className="animate-spin"/> }  Submit</Button>
      </form>
    </Form>



   </Card>
  )
}
