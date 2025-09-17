import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

const FullPageCarousel = ({
  imageURLs,
  currentIndex,
  setCurrentIndex,
}: {
  imageURLs: string[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}) => {
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageURLs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageURLs.length);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-[500px] h-[500px] overflow-hidden relative">
        {imageURLs.map((url, index) => (
          <Image
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity ease-out duration-500 opacity-0 ${
              index === currentIndex && "opacity-100"
            }`}
            src={url}
            key={url}
            alt="Preview"
            width={500}
            height={500}
            draggable={false}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-6">
        <button className="btn btn-ghost btn-circle" onClick={handlePrevious}>
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

        <p className="text-foreground text-lg font-semibold">
          {imageURLs.length > 0 ? currentIndex + 1 : 0} / {imageURLs.length}
        </p>

        <button className="btn btn-ghost btn-circle" onClick={handleNext}>
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
              d="M9.29303 7.29303C9.48056 7.10556 9.73487 7.00024 10 7.00024C10.2652 7.00024 10.5195 7.10556 10.707 7.29303L14.707 11.293C14.8945 11.4806 14.9998 11.7349 14.9998 12C14.9998 12.2652 14.8945 12.5195 14.707 12.707L10.707 16.707C10.5184 16.8892 10.2658 16.99 10.0036 16.9877C9.74143 16.9854 9.49062 16.8803 9.30521 16.6948C9.1198 16.5094 9.01464 16.2586 9.01236 15.9964C9.01008 15.7342 9.11087 15.4816 9.29303 15.293L12.586 12L9.29303 8.70703C9.10556 8.5195 9.00024 8.26519 9.00024 8.00003C9.00024 7.73487 9.10556 7.48056 9.29303 7.29303Z"
              fill="var(--light-foreground)"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FullPageCarousel;
