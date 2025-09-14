import Image from "next/image";
import React from "react";

interface ImageDisplayData {
  id: string;
  width: number;
  height: number;
  src: string;
  alt: string;
  translateX: number;
  translateY: number;
}

const ImageDisplay = (data: ImageDisplayData) => {
  return (
    <div
      className="group"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate3d(${data.translateX}px, ${data.translateY}px, 0)`,
        willChange: "transform",
      }}
    >
      <Image
        key={data.id}
        src={data.src}
        alt={data.alt}
        width={data.width}
        height={data.height}
        draggable={false}
        className="bg-light-background/50 brightness-90"
      />
    </div>
  );
};

export default ImageDisplay;
