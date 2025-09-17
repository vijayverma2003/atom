"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Object } from "../../../database/generated/prisma";
import CompactCarousel from "./CompactCarousel";

type ImageObject = Object & { images: Image[] };
type TransformedImageObject = ImageObject & {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  visible: boolean;
};

const COLUMN_GAP = 24;
const ROW_GAP = 24;
const MIN_WIDTH = 250;
const MAX_COLUMNS = 5;
const MIN_COLUMNS = 2;
const MIN_CONTAINER_WIDTH = 300;

const MasonryGrid = ({ imageObjects }: { imageObjects: ImageObject[] }) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [transformedImageObjects, setTransformedImageObjects] = useState<
    TransformedImageObject[]
  >([]);

  const columnCountRef = useRef<number>(1);
  const columnOffsets = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transformedImagesRef = useRef<TransformedImageObject[]>([]);
  const rAFRef = useRef<number | null>(null);

  const calcTransformations = useCallback(
    (imageObjects: ImageObject[], containerWidth: number, columns: number) => {
      let offsets = columnOffsets.current || Array(columns).fill(0);
      const transformedImageObjects: TransformedImageObject[] = [];

      for (let i = 0; i < imageObjects.length; i++) {
        const shortestColumn = offsets.indexOf(Math.min(...offsets));
        const aspectRatio =
          imageObjects[i].images[0].width / imageObjects[i].images[0].height;
        const width = (containerWidth - COLUMN_GAP * (columns - 1)) / columns;
        const height = width / aspectRatio;
        const column = shortestColumn;
        const translateX = (width + COLUMN_GAP) * column;
        const translateY = offsets[column];

        const newOffsets = [...offsets];
        newOffsets[column] += height + ROW_GAP;
        offsets = newOffsets;

        const transformedImage: TransformedImageObject = {
          ...imageObjects[i],
          width: Math.round(width),
          height: Math.round(height),
          translateX,
          translateY,
          visible: false,
        };

        transformedImageObjects.push(transformedImage);
      }

      return { transformedImages: transformedImageObjects, offsets };
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
        imageObjects,
        contentWidth,
        maxColumns
      );

      columnOffsets.current = transformations.offsets;
      transformedImagesRef.current = transformations.transformedImages;
      setTransformedImageObjects(transformations.transformedImages);
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
    const end = scrollStart + screenHeight * 1.5;

    const visibleImageIds = images
      .filter((image) => image.translateY >= start && image.translateY <= end)
      .map((image) => image.id);

    setTransformedImageObjects((prev) => {
      const images = prev.map((image) =>
        visibleImageIds.includes(image.id)
          ? { ...image, visible: true }
          : { ...image, visible: false }
      );

      transformedImagesRef.current = images;
      return images;
    });
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
      {transformedImageObjects.map(
        (imageObject) =>
          imageObject.visible && (
            <div
              key={imageObject.id}
              style={{
                width: `${imageObject.width}px`,
                height: `${imageObject.height}px`,
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate3d(${imageObject.translateX}px, ${imageObject.translateY}px, 0)`,
                willChange: "transform",
                overflow: "hidden",
              }}
            >
              <CompactCarousel
                images={imageObject.images}
                key={imageObject.id}
                width={imageObject.width}
                height={imageObject.height}
              />
            </div>
          )
      )}
    </div>
  );
};

export default MasonryGrid;
