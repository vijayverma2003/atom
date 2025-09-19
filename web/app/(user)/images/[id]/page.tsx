"use client";

import FullPageCarousel from "@/app/_components/FullPageCarousel";
import AuthContext from "@/context/AuthContext";
import api from "@/services/api.client";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
  Image as ImageData,
  Post,
} from "../../../../../database/generated/prisma";

const page = () => {
  const user = useContext(AuthContext);
  const params = useParams();
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [post, setPost] = useState<Post & { images: ImageData[] }>();

  const fetchData = async () => {
    try {
      const { data: post } = await api.get<Post & { images: ImageData[] }>(
        `/images/${params.id}`
      );

      setPost(post);
    } catch (error) {
      // TODO: Handle errors
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/images/${params.id}`);
      router.push("/");
      router.refresh();
    } catch (error) {
      // TODO: Handle errors
    }
  };

  if (!post) return null;

  return (
    <section className="absolute top-0 left-0 min-h-screen h-full w-full bg-background z-50">
      <div className="absolute top-10 left-10">
        <button onClick={router.back} className="btn btn-faded btn-circle">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.707 7.29303C14.8945 7.48056 14.9998 7.73487 14.9998 8.00003C14.9998 8.26519 14.8945 8.5195 14.707 8.70703L11.414 12L14.707 15.293C14.8892 15.4816 14.99 15.7342 14.9877 15.9964C14.9854 16.2586 14.8803 16.5094 14.6948 16.6948C14.5094 16.8803 14.2586 16.9854 13.9964 16.9877C13.7342 16.99 13.4816 16.8892 13.293 16.707L9.29303 12.707C9.10556 12.5195 9.00024 12.2652 9.00024 12C9.00024 11.7349 9.10556 11.4806 9.29303 11.293L13.293 7.29303C13.4806 7.10556 13.7349 7.00024 14 7.00024C14.2652 7.00024 14.5195 7.10556 14.707 7.29303Z"
              fill="var(--light-foreground)"
            />
          </svg>
        </button>
      </div>
      <div className="grid-upload-page h-full">
        <div className="flex flex-col justify-center items-center gap-6">
          <FullPageCarousel
            imageURLs={post.images.map((image) => image.url)}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          />
        </div>
        <div className="bg-light-background/50 rounded-l-4xl py-8 px-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-8">
              {post.title || "Post"}
            </h1>
            <p className="my-4 text-xl">
              {post.description || "No description found"}
            </p>
          </div>
          {user && user.id === post.userId && (
            <div className="flex justify-center">
              <button
                onClick={handleDelete}
                className="btn btn-faded w-full text-red-700 bg-red-700/10"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default page;
