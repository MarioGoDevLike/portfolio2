import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import Tag from "../ui/Tag";

const accentClass = {
  violet: "text-accent",
  cyan: "text-accent-cyan",
};

const ProjectCard = ({
  title,
  category,
  description,
  image,
  videoSrc,
  href,
  tag,
  accent = "violet",
  featured = false,
}) => {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`project-card group ${href ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`project-card__media ${featured ? "project-card__media--featured" : ""}`}>
        {videoSrc ? (
          <Player autoPlay muted playsInline src={videoSrc} />
        ) : (
          image && (
            <img
              src={image}
              alt={title}
              className="project-card__image"
              loading="lazy"
            />
          )
        )}
        <div className="project-card__overlay" />
        <div className="project-card__hover-tint" />
      </div>

      <div className="project-card__body">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`project-card__category ${accentClass[accent] || accentClass.violet}`}>
              {category}
            </span>
            <h3 className="project-card__title">{title}</h3>
          </div>
          {href && (
            <span className="project-card__cta" aria-hidden="true">
              <BsArrowUpRight size={14} className="text-primary" />
            </span>
          )}
        </div>
        {description && <p className="project-card__description">{description}</p>}
      </div>

      {tag && (
        <div className="absolute top-4 right-4">
          <Tag>{tag}</Tag>
        </div>
      )}
    </Wrapper>
  );
};

export default ProjectCard;
