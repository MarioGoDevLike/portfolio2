import React from "react";

/**
 * Native img with the same loading hints used on Raffoul Motors:
 * lazy + async decode for below-the-fold, eager + high priority for LCP.
 */
const OptimizedImage = ({
  priority = false,
  loading,
  decoding = "async",
  fetchPriority,
  alt = "",
  ...props
}) => (
  <img
    alt={alt}
    {...props}
    loading={loading ?? (priority ? "eager" : "lazy")}
    decoding={decoding}
    fetchPriority={fetchPriority ?? (priority ? "high" : "low")}
  />
);

export default OptimizedImage;
