import React from "react";
import { Link } from "react-router-dom";
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
  imageFit = "cover",
  videoSrc,
  href,
  caseStudyPath,
  tag,
  accent = "violet",
  featured = false,
}) => {
  const isClickable = Boolean(caseStudyPath || href);
  const cardClassName = `project-card group ${isClickable ? "cursor-pointer" : "cursor-default"}`;

  const cardContent = (
    <>
      <div className={`project-card__media ${featured ? "project-card__media--featured" : ""}`}>
        {videoSrc ? (
          <Player autoPlay muted playsInline src={videoSrc} />
        ) : (
          image && (
            <img
              src={image}
              alt={title}
              className={`project-card__image ${
                imageFit === "contain" ? "project-card__image--contain" : ""
              }`}
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
          {isClickable && (
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
    </>
  );

  if (caseStudyPath) {
    return (
      <Link to={caseStudyPath} className={cardClassName}>
        {cardContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
};

export default ProjectCard;
