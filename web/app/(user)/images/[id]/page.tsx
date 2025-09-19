import serverAPI from "@/services/api.server";
import React from "react";

const page = async ({ params }: { params: { id: Promise<string> } }) => {
  const id = await params.id;
  const api = await serverAPI();
  api.get(`/images/${id}`)

  return <div>page</div>;
};

export default page;
