import { useState, useRef } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
};

export function SmartImage({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  style,
}: SmartImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const isLoaded = loaded || (imgRef.current?.complete && (imgRef.current?.naturalWidth ?? 0) > 0);

  return (
    <>
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-stone-200" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={[
          className,
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
        ].filter(Boolean).join(" ")}
        style={style}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-200 text-xs tracking-widest uppercase text-stone-400">
          Gambar tidak tersedia
        </div>
      )}
    </>
  );
}