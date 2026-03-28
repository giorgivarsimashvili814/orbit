import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../lib/api";
import axios from "axios";

interface RegisterForm {
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  if (user) return <Navigate to="/dashboard" />;

  async function onSubmit(data: RegisterForm) {
    try {
      await api.post("/auth/register", data);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("email", {
          message: error.response?.data?.message ?? "Something went wrong",
        });
      }
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter email below to create a new account
          </CardDescription>
          <CardAction>
            <Link to="/login">Login</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
