import React from "react";
import { Navigate, useParams } from "react-router-dom";
import CaseStudy from "../components/project/CaseStudy";
import { getCaseStudy } from "../constants/caseStudies";

const CaseStudyPage = () => {
  const { slug } = useParams();
  const study = getCaseStudy(slug);

  if (!study) return <Navigate to="/projects" replace />;

  // Keyed by slug so gallery/lightbox state resets when moving to the next case study.
  return <CaseStudy key={study.slug} study={study} />;
};

export default CaseStudyPage;
