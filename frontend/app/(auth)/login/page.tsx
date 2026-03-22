"use client";

import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
};

const Page = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error(err.message);
      return;
    }

    const json = await response.json();
    setAuth(json.accessToken, json.user);

    const workspacesRes = await apiFetch("/workspace");

    if (!workspacesRes.ok) {
      router.push("/create-workspace");
      return;
    }

    const workspaces = await workspacesRes.json();
    console.log({ workspaces });

    if (workspaces.length > 0) {
      router.push(`/${workspaces[0].slug}/dashboard`);
    } else {
      router.push("/create-workspace");
    }
  };

  return (
    <form
      className="w-full p-4 flex flex-col gap-5 max-w-125 rounded-lg bg-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          className="bg-gray-200 rounded-lg outline-0 p-2"
          id="email"
          type="email"
          {...register("email")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <input
          className="bg-gray-200 rounded-lg outline-0 p-2"
          id="password"
          type="password"
          {...register("password")}
        />
      </div>
      <button
        className="bg-black text-white rounded-lg p-2 cursor-pointer"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default Page;
