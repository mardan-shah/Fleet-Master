"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import Loading from "@/components/loading/Loading"

const SignUpComponent = () => {
  const { toast } = useToast()
  const { register } = useAuth()
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [organization, setOrganization] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      return "Please fill in all required fields."
    }
    if (password !== confirmPassword) {
      return "Passwords do not match."
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address."
    }
    return ""
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setLoading(true);
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
  
    try {
      await register(email, password, name, role, organization);
      
      toast({
        title: "Account Created",
        description: "You can now sign in with your credentials.",
      });
  
      // Redirect to sign-in page
      router.push("/pages/signin");
    } catch (error: unknown) {
      console.error("Error during sign-up:", error);
      toast({
        title: "Sign-Up Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return <Loading />
  }

  return (
    <div className="w-full flex justify-center my-5">
      <Card className="w-[400px] bg-dark border-dark-border text-gray-light">
        <CardHeader>
          <CardTitle className="text-primaryaccent">Sign Up</CardTitle>
          <CardDescription className="text-gray-muted">Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                disabled={loading}
                className="bg-dark-hover border-dark-border text-gray-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-dark-hover border-dark-border text-gray-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-dark-hover border-dark-border text-gray-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-dark-hover border-dark-border text-gray-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={setRole} required value={role}>
                <SelectTrigger className="bg-dark-hover border-dark-border text-gray-light">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-dark border-dark-border text-gray-light">
                  <SelectItem value="manager">Fleet Manager</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOrganization(e.target.value)}
                disabled={loading}
                className="bg-dark-hover border-dark-border text-gray-light"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-gray-light bg-primaryaccent hover:bg-dark-hover hover:border border-primaryaccent"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-gray-muted">
            Already have an account?{" "}
            <Link href="/pages/signin">
              <Button variant="link" disabled={loading} className="text-primaryaccent hover:opacity-90">
                Sign In
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpComponent