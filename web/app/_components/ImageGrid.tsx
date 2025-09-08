"use client";

import imagesData from "@/public/images/data.json";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageData {
  id: number;
  width: number;
  height: number;
  src: string;
  alt: string;
}

interface TransformedImageData {
  id: number;
  width: number;
  height: number;
  src: string;
  alt: string;
  translateX: number;
  translateY: number;
  visible: boolean;
}

const COLUMN_GAP = 24;
const ROW_GAP = 24;
const MIN_WIDTH = 250;
const MAX_COLUMNS = 5;
const MIN_COLUMNS = 2;
const MIN_CONTAINER_WIDTH = 300;

const ImageGrid = () => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [transformedImages, setTransformedImages] = useState<
    TransformedImageData[]
  >([]);

  const columnCountRef = useRef<number>(1);
  const columnOffsets = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transformedImagesRef = useRef<TransformedImageData[]>([]);
  const rAFRef = useRef<number | null>(null);

  const calcTransformations = useCallback(
    (images: ImageData[], containerWidth: number, columns: number) => {
      let offsets = columnOffsets.current || Array(columns).fill(0);
      const transformedImages: TransformedImageData[] = [];

      for (let i = 0; i < images.length; i++) {
        const shortestColumn = offsets.indexOf(Math.min(...offsets));
        const aspectRatio = images[i].width / images[i].height;
        const width = (containerWidth - COLUMN_GAP * (columns - 1)) / columns;
        const height = width / aspectRatio;
        const column = shortestColumn;
        const translateX = (width + COLUMN_GAP) * column;
        const translateY = offsets[column];

        const newOffsets = [...offsets];
        newOffsets[column] += height + ROW_GAP;
        offsets = newOffsets;

        const transformedImage: TransformedImageData = {
          ...images[i],
          width: Math.round(width),
          height: Math.round(height),
          translateX,
          translateY,
          visible: false,
        };

        transformedImages.push(transformedImage);
      }

      return { transformedImages, offsets };
    },
    []
  );

  const calcDimensions = useCallback(() => {
    const container = containerRef.current;

    if (container) {
      const { paddingLeft, paddingRight } = window.getComputedStyle(container);
      const padding = parseFloat(paddingLeft) + parseFloat(paddingRight);
      const contentWidth = container.clientWidth - padding;
      const columns =
        contentWidth >= MIN_WIDTH
          ? Math.floor(contentWidth / MIN_WIDTH)
          : MIN_COLUMNS;
      const maxColumns = Math.max(Math.min(MAX_COLUMNS, columns), MIN_COLUMNS);

      columnCountRef.current = maxColumns;
      columnOffsets.current = Array(maxColumns).fill(0);
      const transformations = calcTransformations(
        imagesData.slice(0),
        contentWidth,
        maxColumns
      );

      columnOffsets.current = transformations.offsets;
      transformedImagesRef.current = transformations.transformedImages;
      setTransformedImages(transformations.transformedImages);
      setContainerHeight(Math.max(...transformations.offsets, 0));
    }
  }, []);

  const updateVisibleWindow = useCallback(() => {
    const wrapper = containerRef.current;

    if (!wrapper || transformedImagesRef.current.length <= 0) return;

    const images = transformedImagesRef.current;

    const scrollStart = window.scrollY - wrapper.offsetTop;
    const screenHeight = window.innerHeight;
    const start = scrollStart - screenHeight;
    const end = scrollStart + screenHeight;

    const visibleImageIds = images
      .filter((image) => image.translateY >= start && image.translateY <= end)
      .map((image) => image.id);

    setTransformedImages((prev) => {
      const images = prev.map((image) =>
        visibleImageIds.includes(image.id)
          ? { ...image, visible: true }
          : { ...image, visible: false }
      );

      transformedImagesRef.current = images;
      return images;
    });

    console.log("Total Childrens -", containerRef.current?.children.length);
  }, []);

  const handleResize = () => {
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    resizeTimeoutRef.current = setTimeout(() => {
      calcDimensions();
      updateVisibleWindow();
    }, 300);
  };

  const handleScroll = () => {
    if (rAFRef.current !== null) return;

    rAFRef.current = window.requestAnimationFrame(() => {
      rAFRef.current = null;
      updateVisibleWindow();
    });
  };

  useEffect(() => {
    calcDimensions();
    updateVisibleWindow();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (rAFRef.current) window.cancelAnimationFrame(rAFRef.current);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="images-container"
      className="gap-8 relative w-full"
      style={{ height: containerHeight, minWidth: MIN_CONTAINER_WIDTH }}
    >
      {transformedImages.map(
        (image, index) =>
          image.visible && (
            <NextImage
              key={image.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate3d(${image.translateX}px, ${image.translateY}px, 0)`,
                willChange: "transform",
              }}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              draggable={false}
              className="bg-light-background-hover"
            />
          )
      )}
    </div>
  );
};

export default ImageGrid;
