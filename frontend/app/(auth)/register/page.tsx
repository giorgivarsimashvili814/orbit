"use client";

import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/api";

type RegisterForm = {
  email: string;
  password: string;
};

const Page = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(response.json());
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
        Register
      </button>
    </form>
  );
};

export default Page;
