"use client";

import Carousel from "@/app/_components/Carousel";
import FilesContext from "@/context/FilesContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import {
  ImageObjectData,
  imageObjectSchema,
} from "@/../shared/validation/image-object";
import { zodResolver } from "@hookform/resolvers/zod";

const FileUploadPage = () => {
  const { files: uploadedFiles } = useContext(FilesContext);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const componentReloadRef = useRef(0);

  const {
    register,
    setValue,
    formState: { isValid, errors: formErrors },
    handleSubmit,
    trigger,
  } = useForm<ImageObjectData>({
    resolver: zodResolver(imageObjectSchema),
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

  const onSubmit = handleSubmit((data) => {
    // Todo - Handle Form Submission

    console.log(data);
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
              fill="var(--light-foreground)"
            />
          </svg>
        </button>
      </div>
      <div className="grid-upload-page h-full">
        <div className="flex flex-col justify-center items-center gap-6">
          <Carousel
            imageURLs={previewURLs}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
            onRemove={handleImageRemove}
          />
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
        <div className="bg-light-background-hover rounded-l-4xl py-8 px-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-12">Create Object</h1>
            <div className="mb-12">
              <h2 className="mb-8">Selected Images</h2>
              {previewURLs.length > 0 ? (
                <div className="flex items-center gap-4 overflow-x-scroll no-scrollbar overflow-y-hidden">
                  {previewURLs.map((url, index) => (
                    <Image
                      src={url}
                      alt="Preview"
                      width={100}
                      height={100}
                      key={url}
                      onClick={() => setCurrentImageIndex(index)}
                      className="cursor-pointer object-cover max-h-[100px] max-w-[100px]"
                      draggable={false}
                    />
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
