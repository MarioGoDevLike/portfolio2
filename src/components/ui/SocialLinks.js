import React from "react";
import { SiGmail } from "react-icons/si";
import { SOCIAL_LINKS } from "../../constants";

const pillClass = (variant) =>
  variant === "pill" ? "social-link social-link--pill" : "social-link social-link--ghost";

const iconSize = (variant) => (variant === "pill" ? 16 : 15);

const SocialLinks = ({ variant = "pill", className = "", email }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {email && (
      <a
        href={`mailto:${email}`}
        aria-label="Send email"
        className={pillClass(variant)}
      >
        <SiGmail size={iconSize(variant)} />
      </a>
    )}
    {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
      <a
        key={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={pillClass(variant)}
      >
        <Icon size={iconSize(variant)} />
      </a>
    ))}
  </div>
);

export default SocialLinks;
