"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInForm() {
  const { signIn, setSession, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSession(result.createdSessionId);
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Something went wrong");
    }
  }

  async function oauthLogin(provider) {
    await signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  }

  return (
    <Card className="w-[350px] mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Sign In
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => oauthLogin("oauth_google")}
            className="w-full"
          >
            Continue with Google
          </Button>

          <Button
            variant="outline"
            onClick={() => oauthLogin("oauth_discord")}
            className="w-full"
          >
            Continue with Discord
          </Button>
        </div>

        <div className="flex items-center my-3">
          <div className="flex-1 border-t" />
          <span className="px-2 text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t" />
        </div>

        {/* Email + Password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
