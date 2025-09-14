import MasonryGrid from "@/app/_components/MasonryGrid";
import { getClientUser } from "@/services/users";
import Image from "next/image";
import { redirect } from "next/navigation";
import Tabs from "../_components/Tabs";

export default async function ProfilePage() {
  const { user, error } = await getClientUser();
  if (!user || error) redirect("/");

  console.log(user);

  return (
    <section className="p-container mx-auto p-8">
      <div className="flex items-center gap-8 mb-8">
        <div className="w-[80px] h-[80px] relative rounded-full avatar-gradient cursor-pointer overflow-hidden">
          {user.avatar && (
            <Image
              priority
              sizes="100%"
              fill
              src={user.avatar}
              alt="User Avatar"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="my-16">
        <Tabs />
      </div>
    </section>
  );
}
