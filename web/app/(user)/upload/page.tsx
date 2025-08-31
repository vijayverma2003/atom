"use client";

import FilesContext from "@/context/FilesContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const FileUploadPage = () => {
  const { files: uploadedFiles } = useContext(FilesContext);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const createPreviewURL = (file: File) => {
    return URL.createObjectURL(file);
  };

  useEffect(() => {
    const previewURLs: string[] = [];

    for (let file of uploadedFiles) previewURLs.push(createPreviewURL(file));

    setPreviewURLs(previewURLs);
    setFiles([...uploadedFiles]);

    return () => {
      for (let url of previewURLs) URL.revokeObjectURL(url);
    };
  }, [uploadedFiles]);

  return (
    <section className="absolute top-0 left-0 min-h-screen h-full w-full bg-background">
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
              fill="var(--light-forground)"
            />
          </svg>
        </button>
      </div>
      <div className="grid-upload-page h-full">
        <div className="flex justify-center items-center whitespace-nowrap">
          <div className="flex justify-start items-start w-[500px] h-[500px] overflow-hidden">
            {previewURLs.map((url, index) => (
              <Image
                src={url}
                alt="Preview"
                key={url}
                width={500}
                height={500}
              />
            ))}
          </div>
        </div>
        <div className="bg-light-background-hover rounded-l-4xl py-8 px-8">
          <h1 className="text-3xl font-semibold mb-12">Create Object</h1>
          <div className="my-4">
            <label htmlFor="title">Title</label>
            <input name="title" id="title" type="text" />
          </div>
          <div className="my-4">
            <label htmlFor="title">Description</label>
            <textarea rows={10} name="description" id="description" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUploadPage;
