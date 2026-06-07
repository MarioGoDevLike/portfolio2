import React from "react";
import { SOCIAL_LINKS } from "../../constants";

const SocialLinks = ({ variant = "pill", className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
      <a
        key={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={
          variant === "pill"
            ? "social-link social-link--pill"
            : "social-link social-link--ghost"
        }
      >
        <Icon size={variant === "pill" ? 16 : 15} />
      </a>
    ))}
  </div>
);

export default SocialLinks;
