import { useCallback, useEffect, useRef, useState } from "react";
import {
  HEADER_NAV,
  SCROLL_DURATION,
  SCROLL_OFFSET,
} from "../constants";

const SECTION_IDS = ["home", ...HEADER_NAV.map((item) => item.to)];

const useSectionScroll = () => {
  const [activeSection, setActiveSection] = useState("home");
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef(null);

  const beginScrollTo = useCallback((sectionId) => {
    setActiveSection(sectionId);
    isScrollingRef.current = true;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, SCROLL_DURATION + 60);
  }, []);

  useEffect(() => {
    const resolveActiveSection = () => {
      if (isScrollingRef.current) return;

      const marker = window.scrollY + Math.abs(SCROLL_OFFSET) + 24;
      let current = "home";

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", resolveActiveSection, { passive: true });
    resolveActiveSection();

    return () => {
      window.removeEventListener("scroll", resolveActiveSection);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return { activeSection, beginScrollTo };
};

export default useSectionScroll;
