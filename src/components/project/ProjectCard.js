import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowUpRight } from "react-icons/bs";
import Tag from "../ui/Tag";
import ProjectShowcase from "./ProjectShowcase";
import { saveHomeScroll } from "../../utils/homeScroll";

const accentClass = {
  violet: "text-accent",
  cyan: "text-accent-cyan",
};

const ProjectCard = ({
  title,
  category,
  description,
  logo,
  logoBadge,
  showcase,
  href,
  caseStudyPath,
  tag,
  accent = "violet",
  featured = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const isClickable = Boolean(caseStudyPath || href);
  const cardClassName = `project-card group ${isClickable ? "cursor-pointer" : "cursor-default"}`;
  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const cardContent = (
    <>
      <div className={`project-card__media ${featured ? "project-card__media--featured" : ""}`}>
        <ProjectShowcase project={{ title, logo, logoBadge, showcase, accent }} active={hovered} />
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
      <Link to={caseStudyPath} onClick={saveHomeScroll} className={cardClassName} {...hoverProps}>
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
        {...hoverProps}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName} {...hoverProps}>{cardContent}</div>;
};

export default ProjectCard;
