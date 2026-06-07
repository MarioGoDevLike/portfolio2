import React from "react";

const Tag = ({ children, className = "" }) => (
  <span className={`tag ${className}`}>{children}</span>
);

export default Tag;
