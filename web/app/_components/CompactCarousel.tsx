"use client";

import NextImage from "next/image";
import { useState } from "react";
import { Image } from "../../../database/generated/prisma";

const CompactCarousel = ({
  images,
  width,
  height,
}: {
  images: Image[];
  width: number;
  height: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative group" style={{ width, height }}>
      {images.map((image, index) => (
        <NextImage
          className={`absolute top-0 left-0 w-full h-full object-contain opacity-0 ${
            index === currentIndex && "opacity-100"
          }`}
          src={image.url}
          key={image.id}
          alt="Preview"
          draggable={false}
          width={width}
          height={height}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 ease-out" />

      {images.length > 1 && (
        <div className="absolute bottom-0 left-[50%] -translate-x-[50%] py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
          {images.map((_, index) => (
            <button
              key={_.id}
              className={`cursor-pointer w-3 h-3 rounded-full mx-1 bg-white ${
                index === currentIndex ? "opacity-90" : "opacity-50"
              }`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompactCarousel;
