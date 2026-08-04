import { ImgHTMLAttributes, useState } from "react";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export function SmartImage({
  className = "",
  alt = "",
  loading = "lazy",
  ...props
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Skeleton */}
      {!loaded && !error && (
        <>
          <div className="absolute inset-0 animate-pulse bg-zinc-200/70" />

          <div
            className="
              absolute
              inset-0
              -translate-x-full
              animate-[shimmer_1.6s_infinite]
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />
        </>
      )}

      <img
        {...props}
        loading={loading}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          setError(true);
        }}
        className={`
          transition-all
          duration-700
          ease-out
          ${
            loaded
              ? "opacity-100 blur-0 scale-100"
              : "opacity-0 blur-md scale-[1.03]"
          }
          ${className}
        `}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-xs tracking-widest uppercase text-zinc-400">
          Image unavailable
        </div>
      )}

      <style>
        {`
          @keyframes shimmer {
            100% {
              transform: translateX(200%);
            }
          }
        `}
      </style>
    </div>
  );
}