const WEBP = import.meta.env.PROD;

function webpSrc(src) {
  if (!WEBP || !src) return "";
  return src.replace(/\.jpe?g$/i, ".webp");
}

export default function OptimizedImage({
  src,
  alt = "",
  className,
  width,
  height,
  priority = false,
}) {
  const webp = webpSrc(src);

  if (webp && webp !== src) {
    return (
      <picture>
        <source srcSet={webp} type="image/webp" />
        <img
          src={src}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
