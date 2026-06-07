import React from "react";
import { SKILLS } from "../../constants";

const TRACK_ITEMS = [...SKILLS, ...SKILLS];

const MarqueeSection = () => (
  <div className="marquee-section" aria-hidden="true">
    <div className="marquee-track-ltr">
      {TRACK_ITEMS.map((skill, index) => (
        <div key={`${skill}-${index}`} className="flex items-center">
          <span className="marquee-item">{skill}</span>
          <span className="marquee-separator">◆</span>
        </div>
      ))}
    </div>
  </div>
);

export default MarqueeSection;
