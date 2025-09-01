"use client";

import FilesContext from "@/context/FilesContext";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const ShareImageIconButton = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { onFileDataChange } = useContext(FilesContext);
  const router = useRouter();

  const handleFileInputClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileDataChange([...event.target.files]);
      router.push("/upload");
    }
  };

  return (
    <div className="relative tooltip-trigger">
      <Link href="/upload" className="btn btn-ghost btn-circle">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.576 14.576L15.707 10.707C15.5195 10.5195 15.2652 10.4142 15 10.4142C14.7348 10.4142 14.4805 10.5195 14.293 10.707L6.865 18.135C5.74832 17.1998 4.90816 15.9775 4.43512 14.5999C3.96208 13.2223 3.87413 11.7417 4.18074 10.3177C4.48735 8.89382 5.17689 7.58063 6.17499 6.5198C7.17309 5.45897 8.44187 4.69077 9.84449 4.29804C11.2471 3.90532 12.7303 3.90298 14.1342 4.29128C15.538 4.67957 16.8092 5.44377 17.8107 6.50145C18.8121 7.55912 19.5058 8.87014 19.8169 10.2931C20.128 11.716 20.0447 13.1969 19.576 14.576ZM12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22ZM11 10C11 10.5304 10.7893 11.0391 10.4142 11.4142C10.0391 11.7893 9.53043 12 9 12C8.46957 12 7.96086 11.7893 7.58579 11.4142C7.21071 11.0391 7 10.5304 7 10C7 9.46957 7.21071 8.96086 7.58579 8.58579C7.96086 8.21071 8.46957 8 9 8C9.53043 8 10.0391 8.21071 10.4142 8.58579C10.7893 8.96086 11 9.46957 11 10Z"
            fill="var(--light-foreground)"
          />
        </svg>
      </Link>
      <div className="py-2 tooltip-content absolute top-[100%] right-0">
        <div className="bg-light-background-hover py-4 px-8 flex flex-col items-center justify-center gap-2 rounded-2xl border border-light-background">
          <input
            ref={fileInputRef}
            id="nav-file-input"
            name="nav-file-input"
            type="file"
            multiple
            hidden
            accept="image/*"
            max={10}
            onChange={handleFileInputChange}
          />
          <h4 className="mb-4 font-semibold">Create Objects</h4>
          <button
            onClick={handleFileInputClick}
            className="btn whitespace-nowrap text-lg"
          >
            Select Files
          </button>
          <p className="text-dark-foreground text-center my-4 text-sm whitespace-nowrap">
            Drag and Drop images <br /> on page to upload
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareImageIconButton;
