"use client";

import { DragEvent, PropsWithChildren, useRef, useState } from "react";

const DropArea = ({ children }: PropsWithChildren) => {
  const [activated, setActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActivated(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActivated(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Dropped", e.dataTransfer?.files);

    setActivated(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="drop-area min-h-screen"
      >
        {children}
      </div>
      {activated && (
        <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-background/95 z-50 pointer-events-none drop-animation">
          <div className="max-w-[280px] w-full min-h-[200px] bg-light-background-hover rounded-3xl flex justify-center items-center">
            <div className="border-2 border-dashed border-dark-foreground/10 max-w-[calc(280px-20px)] w-full min-h-[calc(200px-20px)] rounded-3xl flex flex-col justify-center items-center gap-8">
              <div className="relative">
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
                <div className="absolute w-[100px] h-[100px] bg-light-background rounded-xl flex justify-center items-center  border border-dark-foreground/10 translate-y-[-100%] drop-animation-image">
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
              <p className="font-bold text-dark-foreground">
                Drag and Drop Images
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropArea;
