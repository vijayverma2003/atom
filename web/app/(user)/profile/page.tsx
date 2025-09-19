import MasonryGrid from "@/app/_components/MasonryGrid";
import serverAPI from "@/services/api.server";
import { getClientUser } from "@/services/users";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Image as ImageData,
  Post,
} from "../../../../database/generated/prisma";

export default async function ProfilePage() {
  const { user, error } = await getClientUser();
  if (!user || error) redirect("/");

  const api = await serverAPI();
  const { data } = await api.get<(Post & { images: ImageData[] })[]>(
    `/images?userId=${user.id}`
  );

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
          <h2 className="text-4xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="my-16">
        <h2 className="my-8 text-3xl font-bold">Your Posts</h2>
        <MasonryGrid posts={data} />
      </div>
    </section>
  );
}
