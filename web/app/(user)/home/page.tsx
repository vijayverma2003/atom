import serverAPI from "@/services/api.server";
import { Image, Post } from "../../../../database/generated/prisma";
import MasonryGrid from "@/app/_components/MasonryGrid";

const Home = async () => {
  const api = await serverAPI();
  const response = await api.get<(Post & { images: Image[] })[]>("/images");

  return (
    <main className="p-container">
      <MasonryGrid posts={response.data.length > 0 ? response.data : []} />
    </main>
  );
};

export default Home;
