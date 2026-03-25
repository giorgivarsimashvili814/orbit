import { useForm } from "react-hook-form";
import { useAuth } from "../context/useAuth";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import axios from "axios";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

interface CreateWs {
  name: string;
}

export default function CreateWs() {
  const navigate = useNavigate();
  const { loading, accessToken } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateWs>();

  if (loading) return null;

  async function onSubmit(data: CreateWs) {
    try {
      const res = await api.post("/workspace", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const workspace = res.data;
      navigate(`/${workspace.slug}/issues`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("name", {
          message: error.response?.data?.message ?? "Something went wrong",
        });
      }
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create a workspace</CardTitle>
          <CardDescription>
            Enter name below to create a workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Workspace name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="myWorkspace123"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs">{errors.name.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
