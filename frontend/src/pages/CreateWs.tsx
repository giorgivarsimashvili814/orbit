import { useForm } from "react-hook-form";
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
import { useWorkspace } from "@/context/workspace/useWorkspace";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

interface CreateWs {
  name: string;
  slug: string;
}

const URL_PREFIX = "app.orbit-dev.cv/";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const slugValidationRules = (
  checkSlug: () => void,
  clearErrors: () => void,
) => ({
  onChange: () => {
    clearErrors();
    checkSlug();
  },
  required: "Required",
  minLength: { value: 3, message: "Too short, must be at least 3 characters" },
  maxLength: {
    value: 32,
    message: "Too long, cannot be more than 32 characters",
  },
  pattern: {
    value: /^[a-z0-9-]+$/,
    message: "Invalid format, can only contain letters, numbers, and dashes",
  },
  validate: async (value: string) => {
    if (!value || value.length < 3) return true;
    try {
      const res = await api.get(`/workspace/check-slug?slug=${value}`);
      return res.data.available || "This URL is already taken";
    } catch {
      return true;
    }
  },
});

export default function CreateWs() {
  const navigate = useNavigate();
  const { refreshWorkspaces } = useWorkspace();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<CreateWs>();

  const name = watch("name");

  const checkSlug = useDebouncedCallback(() => trigger("slug"), 500);

  useEffect(() => {
    if (!name?.trim()) {
      setValue("slug", "", { shouldValidate: false });
      return;
    }
    setValue("slug", toSlug(name), { shouldValidate: false });
    checkSlug();
  }, [name, setValue, checkSlug]);

  async function onSubmit(data: CreateWs) {
    try {
      const res = await api.post("/workspace", data);
      await refreshWorkspaces();
      navigate(`/${res.data.slug}/team/${res.data.teamKey}/issues/active`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("slug", {
          message: error.response?.data?.message ?? "Something went wrong",
        });
      }
    }
  }

  const buttonLabel = isSubmitting
    ? "Creating..."
    : isValidating
      ? "Checking..."
      : "Create";

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
                  {...register("name", {
                    required: "Required",
                    minLength: {
                      value: 2,
                      message: "Too short, must be at least 2 characters",
                    },
                    maxLength: {
                      value: 80,
                      message: "Too long, cannot be more than 80 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Workspace URL</Label>
                <div className="relative flex items-center">
                  <Input
                    id="slug"
                    className="pl-29.5"
                    {...register(
                      "slug",
                      slugValidationRules(checkSlug, () => clearErrors("slug")),
                    )}
                  />
                  <span className="absolute left-3 text-sm text-muted-foreground pointer-events-none">
                    {URL_PREFIX}
                  </span>
                </div>
                {errors.slug && (
                  <p className="text-red-400 text-xs">{errors.slug.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting || isValidating}
              >
                {buttonLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
