import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const Page = async () => {
  const cookieStore = await cookies();
  const hasToken = cookieStore.get("refreshToken");
  redirect(hasToken ? "/create-workspace" : "/login");
};

export default Page;
