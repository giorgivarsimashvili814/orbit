"use client";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();

  const { user } = useAuthStore();
  const { register, handleSubmit } = useForm<{ name: string }>();

  const onSubmit = async (data: { name: string }) => {
    const response = await apiFetch("/workspace", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const { slug } = await response.json();

    router.push(`/${slug}/dashboard`);
  };

  return (
    <div className="bg-[#fbfbfc] flex justify-between items-start h-screen px-4 py-3">
      <button>Log out</button>
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-2xl font-medium">Create a new workspace</h1>
        <p className="text-lg font-medium">
          workspaces are shared environments where teams can work <br />
          on projects and issues
        </p>
        <form
          className="w-full p-4 flex flex-col gap-5 max-w-125 rounded-lg bg-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Workspace name</label>
            <input
              className="bg-gray-200 rounded-lg outline-0 p-2"
              id="name"
              type="text"
              {...register("name")}
            />
          </div>
          <button
            className="bg-black text-white rounded-lg p-2 cursor-pointer"
            type="submit"
          >
            Create workspace
          </button>
        </form>
      </div>
      <article>
        <p>Logged in as</p>
        <h1>{user?.email}</h1>
      </article>
    </div>
  );
};

export default Page;
