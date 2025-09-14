import MasonryGrid from "@/app/_components/MasonryGrid";
import React from "react";
import imagesData from "@/public/images/data.json";

const Home = () => {
  return (
    <main className="p-container">
      <h1 className="text-4xl font-bold mb-12">Home</h1>
      <MasonryGrid imagesData={imagesData} />
    </main>
  );
};

export default Home;
