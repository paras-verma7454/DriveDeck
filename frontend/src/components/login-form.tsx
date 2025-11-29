
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { ENDPOINT_URL } from "@/hooks/user"



export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading]= useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      if (localStorage.getItem("Authorization")) {
        navigate("/dashboard");
      }
    }, [ navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setloading(true)
    try {
       const response = await axios.post(`${ENDPOINT_URL}/v1/auth/login`, {
        Email: email,
        Password: password,
      });
      console.log(response.data.user);

      if (response.data.token) {
        localStorage.setItem('Authorization', `Bearer ${response.data.token}`);
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        setloading(false);
        toast.error("Login failed. Please check your credentials.");
      }

    } catch (error) {
      setloading(false);
      console.error('Error:', error);
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link> */}
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              </Field>
              <Field>
                <Button className="cursor-pointer" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Don't have an account? <Link to={"/"}>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
