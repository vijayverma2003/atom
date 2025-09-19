"use client";

import {
  ImageFormData,
  imageFormSchema,
  ImageObjectData,
} from "@/../shared/validation/image-object";
import FullPageCarousel from "@/app/_components/FullPageCarousel";
import FilesContext from "@/context/FilesContext";
import api from "@/services/api.client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Post } from "../../../../database/generated/prisma";
import ToastContext from "@/context/ToastContext";

const FileUploadPage = () => {
  const { files: uploadedFiles } = useContext(FilesContext);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const componentReloadRef = useRef(0);
  const { addToast } = useContext(ToastContext);

  const {
    register,
    setValue,
    formState: { isValid, errors: formErrors },
    handleSubmit,
    trigger,
    reset,
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    mode: "onChange",
  });

  const createPreviewURLs = (files: File[]) => {
    const urls: string[] = [];

    for (let file of files) urls.push(URL.createObjectURL(file));
    return urls;
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentFiles = [...files];
    const newFiles: File[] = [];

    if (e.target.files) {
      for (let file of e.target.files)
        if (!currentFiles.includes(file)) newFiles.push(file);
    }

    setFiles([...currentFiles, ...newFiles]);
    setPreviewURLs((urls) => [...urls, ...createPreviewURLs(newFiles)]);
  };

  const handleImageRemove = (index: number) => {
    const currentFiles = [...files];
    const currentPreviews = [...previewURLs];

    currentFiles.splice(index, 1);
    currentPreviews.splice(index, 1);

    setFiles(currentFiles);
    setPreviewURLs(currentPreviews);
    setCurrentImageIndex(0);
    setValue("images", currentFiles);
  };

  const createImageHash = async (image: File) => {
    const buffer = await image.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashString = hashArray.map((byte) =>
      byte.toString(16).padStart(2, "0")
    );
    return hashString.join("");
  };

  const getImageDimensions = (
    image: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = async () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };

      img.onerror = (error) => reject(error);
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    // Todo - Handle Form Submission

    const images: {
      name: string;
      hash: string;
      url: string;
      width: number;
      height: number;
      type: string;
      size: number;
      key: string;
    }[] = [];

    for (let image of data.images) {
      console.log("Image", image);

      try {
        const dimensions = await getImageDimensions(image);
        const hash = await createImageHash(image);

        const presignedUrlData = {
          name: image.name,
          size: image.size,
          type: image.type,
          hash: hash,
        };

        const {
          data: { signedUrl, imageUrl, key },
        } = await api.post(`/images/get-presigned-url`, presignedUrlData);

        if (signedUrl) {
          await axios.put(signedUrl, image, {
            headers: { "Content-Type": image.type },
          });
        }

        images.push({
          hash,
          name: image.name,
          url: imageUrl,
          width: dimensions.width,
          height: dimensions.height,
          type: image.type,
          size: image.size,
          key,
        });
      } catch (error) {
        addToast("error", "An error occured while uploading images");
        return;
      }
    }

    try {
      const response = await api.post<ImageObjectData, AxiosResponse<Post>>(
        `/images/create`,
        {
          title: data.title,
          description: data.description,
          images,
        }
      );

      addToast("success", "Post Created");
      router.push(`/images/${response.data.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        addToast(
          "error",
          error.response?.data.message ||
            "An error occured while uploading images"
        );
      } else addToast("error", "An error occured while uploading images");
    }
  });

  useEffect(() => {
    const currentFiles = [...files];

    const newFiles: File[] = [];

    for (let file of uploadedFiles)
      if (!newFiles.includes(file) && !currentFiles.includes(file))
        newFiles.push(file);

    const updatedFiles = [...currentFiles, ...newFiles];
    const newPreviewURLs: string[] = createPreviewURLs(newFiles);

    if (updatedFiles.length > 0) setFiles(updatedFiles);
    if (newPreviewURLs.length > 0)
      setPreviewURLs((currentPreviews) => [
        ...currentPreviews,
        ...newPreviewURLs,
      ]);

    return () => {
      for (let url of previewURLs) URL.revokeObjectURL(url);
    };
  }, [uploadedFiles]);

  useEffect(() => {
    setValue("images", files);
    if (componentReloadRef.current > 0) trigger("images");
    componentReloadRef.current++;
  }, [files]);

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
          {files.length > 0 ? (
            <FullPageCarousel
              imageURLs={previewURLs}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
            />
          ) : (
            <div className="relative mb-12">
              <div className="w-[100px] h-[100px] bg-light-background rounded-xl flex justify-center items-center border border-dark-foreground/10">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40.7833 30.3667L32.7229 22.3062C32.3322 21.9157 31.8024 21.6963 31.25 21.6963C30.6975 21.6963 30.1677 21.9157 29.777 22.3062L14.302 37.7812C11.9756 35.8329 10.2253 33.2864 9.23979 30.4164C8.2543 27.5464 8.07106 24.4618 8.70983 21.4953C9.3486 18.5288 10.7851 15.793 12.8645 13.5829C14.9439 11.3728 17.5872 9.77242 20.5093 8.95424C23.4314 8.13607 26.5215 8.1312 29.4461 8.94015C32.3708 9.7491 35.0192 11.3412 37.1055 13.5447C39.1918 15.7482 40.637 18.4794 41.2851 21.4439C41.9332 24.4084 41.7597 27.4936 40.7833 30.3667ZM25 45.8333C36.5062 45.8333 45.8333 36.5062 45.8333 25C45.8333 13.4937 36.5062 4.16666 25 4.16666C13.4937 4.16666 4.16663 13.4937 4.16663 25C4.16663 36.5062 13.4937 45.8333 25 45.8333ZM22.9166 20.8333C22.9166 21.9384 22.4776 22.9982 21.6962 23.7796C20.9148 24.561 19.855 25 18.75 25C17.6449 25 16.5851 24.561 15.8037 23.7796C15.0223 22.9982 14.5833 21.9384 14.5833 20.8333C14.5833 19.7283 15.0223 18.6684 15.8037 17.887C16.5851 17.1056 17.6449 16.6667 18.75 16.6667C19.855 16.6667 20.9148 17.1056 21.6962 17.887C22.4776 18.6684 22.9166 19.7283 22.9166 20.8333Z"
                    fill="var(--dark-foreground)"
                  />
                </svg>
              </div>
              <div className="absolute w-[100px] h-[100px] bg-light-background rounded-xl flex justify-center items-center  border border-dark-foreground/10 translate-y-[-100%] drop-animation-image rotate-12">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40.7833 30.3667L32.7229 22.3062C32.3322 21.9157 31.8024 21.6963 31.25 21.6963C30.6975 21.6963 30.1677 21.9157 29.777 22.3062L14.302 37.7812C11.9756 35.8329 10.2253 33.2864 9.23979 30.4164C8.2543 27.5464 8.07106 24.4618 8.70983 21.4953C9.3486 18.5288 10.7851 15.793 12.8645 13.5829C14.9439 11.3728 17.5872 9.77242 20.5093 8.95424C23.4314 8.13607 26.5215 8.1312 29.4461 8.94015C32.3708 9.7491 35.0192 11.3412 37.1055 13.5447C39.1918 15.7482 40.637 18.4794 41.2851 21.4439C41.9332 24.4084 41.7597 27.4936 40.7833 30.3667ZM25 45.8333C36.5062 45.8333 45.8333 36.5062 45.8333 25C45.8333 13.4937 36.5062 4.16666 25 4.16666C13.4937 4.16666 4.16663 13.4937 4.16663 25C4.16663 36.5062 13.4937 45.8333 25 45.8333ZM22.9166 20.8333C22.9166 21.9384 22.4776 22.9982 21.6962 23.7796C20.9148 24.561 19.855 25 18.75 25C17.6449 25 16.5851 24.561 15.8037 23.7796C15.0223 22.9982 14.5833 21.9384 14.5833 20.8333C14.5833 19.7283 15.0223 18.6684 15.8037 17.887C16.5851 17.1056 17.6449 16.6667 18.75 16.6667C19.855 16.6667 20.9148 17.1056 21.6962 17.887C22.4776 18.6684 22.9166 19.7283 22.9166 20.8333Z"
                    fill="var(--dark-foreground)"
                  />
                </svg>
              </div>
            </div>
          )}
          <div>
            <input
              id="file-input"
              name="file-input"
              type="file"
              multiple
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <button className="btn btn-faded" onClick={handleFileInputClick}>
              Select Images
            </button>
          </div>
        </div>
        <div className="bg-light-background/50 rounded-l-4xl py-8 px-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-12">Create Object</h1>
            <div className="mb-12">
              <h2 className="mb-8">Selected Images</h2>
              {previewURLs.length > 0 ? (
                <div className="flex items-center gap-4 overflow-x-scroll no-scrollbar py-4">
                  {previewURLs.map((url, index) => (
                    <div key={url} className="relative group">
                      <button
                        className="btn btn-faded cursor-pointer btn-circle absolute right-0 top-0 translate-y-[-50%] translate-x-[50%] z-10 w-[14px] h-[14px] opacity-0 group-hover:opacity-100"
                        onClick={() => handleImageRemove(index)}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"
                            stroke="var(--dark-foreground)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <NextImage
                        src={url}
                        alt="Preview"
                        width={100}
                        height={100}
                        onClick={() => setCurrentImageIndex(index)}
                        className="cursor-pointer object-cover max-h-[100px] max-w-[100px] group-hover:opacity-50 transition-opacity ease-out duration-300"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <span className="badge">No images selected</span>
                </div>
              )}
            </div>
            <div className="my-4">
              <label htmlFor="title">Title</label>
              <input id="title" {...register("title")} />
            </div>
            <div className="my-4">
              <label htmlFor="description">Description</label>
              <textarea
                rows={10}
                id="description"
                {...register("description")}
              />
            </div>
          </div>
          <div>
            {Object.keys(formErrors).length > 0 && (
              <div className="mb-4 bg-red-600/10 border border-red-600/20 py-4 px-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Errors</h3>
                <ol>
                  <li className="mb-2">{formErrors.title?.message}</li>
                  <li className="mb-2">{formErrors.description?.message}</li>
                  <li className="mb-2">{formErrors.images?.message}</li>
                </ol>
              </div>
            )}
            <div className="flex justify-center">
              <button
                onClick={onSubmit}
                className="btn btn-faded w-full"
                disabled={!isValid}
              >
                Create Object
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUploadPage;
