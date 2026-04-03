interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  lazy?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  lazy = true,
  className = "",
  style,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? "lazy" : undefined}
      decoding={lazy ? "async" : undefined}
      sizes={sizes}
      className={className}
      style={style}
    />
  );
}
