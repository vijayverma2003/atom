import { getClientUser } from "@/services/users";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "./_components/Logo";

export default async function Home() {
  const { user, error } = await getClientUser();

  if (user) redirect("/home");

  const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL + "/";

  return (
    <nav className="flex justify-between items-center p-container">
      <h1 className="text-3xl font-bold">
        <Logo />
      </h1>
      <div className="space-x-4">
        <Link
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google?redirectURL=${redirectUrl}`}
          className="btn btn-primary"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
