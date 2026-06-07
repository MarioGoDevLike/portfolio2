import React from "react";

const SectionHeader = ({
  label,
  title,
  description,
  align = "left",
  className = "",
}) => (
  <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
    {label && <span className="label">{label}</span>}
    {title && <h2 className="h2">{title}</h2>}
    {description && <p className="text-body-sm text-white/30 max-w-md">{description}</p>}
  </div>
);

export default SectionHeader;
