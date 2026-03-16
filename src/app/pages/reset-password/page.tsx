"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handlePasswordResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder for reset password logic
    setTimeout(() => {
      toast({
        title: "Functionality Not Implemented",
        description: "Password reset requires an email service provider (e.g., SendGrid, Mailgun).",
        variant: "destructive",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full flex justify-center my-5">
      <Card className="w-[350px] bg-dark border-dark-border text-gray-light">
        <CardHeader>
          <CardTitle className="text-primaryaccent">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordResetRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-dark-hover border-dark-border text-gray-light"
              />
            </div>
            <Button
              type="submit"
              className="w-full text-gray-light bg-primaryaccent hover:bg-dark-hover hover:border border-primaryaccent"
              disabled={loading}
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/pages/signin" passHref>
            <Button variant="link" className="text-primaryaccent">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordComponent;
