import React, { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { HEADER_NAV, SCROLL_DURATION, SCROLL_OFFSET, SITE } from "../../constants";
import useSectionScroll from "../../hooks/useSectionScroll";

const EASE_EXPO = [0.22, 1, 0.36, 1];

const scrollProps = {
  smooth: true,
  duration: SCROLL_DURATION,
  offset: SCROLL_OFFSET,
  ease: "easeOutCubic",
};

const Header = () => {
  const { activeSection, beginScrollTo } = useSectionScroll();
  const [hoveredNav, setHoveredNav] = useState(null);

  const highlightedNav =
    hoveredNav ??
    (HEADER_NAV.some((n) => n.to === activeSection) ? activeSection : null);

  const [firstName, lastName] = SITE.name.split(" ");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center px-5 lg:px-8 pt-5 pointer-events-none">
      <motion.div
        className="desktop-header__shell pointer-events-auto"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
      >
        {/* ── Left: brand + status ── */}
        <Link
          to="home"
          {...scrollProps}
          offset={0}
          className="desktop-header__brand cursor-pointer"
          onClick={() => beginScrollTo("home")}
        >
          <div className="desktop-header__monogram" aria-hidden="true">
            <span className="text-white">{firstName[0]}</span>
            <span className="text-[#7B96FF]">{lastName[0]}</span>
          </div>

          <div className="desktop-header__identity">
            <span className="desktop-header__name">
              {firstName}{" "}
              <span className="text-[#7B96FF]">{lastName}</span>
            </span>
            <span className="desktop-header__role">{SITE.role}</span>
          </div>

          {/* <div className="desktop-header__status">
            <span className="desktop-header__status-dot" />
            <span className="desktop-header__status-label">Available</span>
          </div> */}
        </Link>

        {/* ── Center: nav ── */}
        <nav className="desktop-header__nav-track" aria-label="Primary">
          {HEADER_NAV.map(({ label, to }) => {
            const isActive = activeSection === to;
            const isHighlighted = highlightedNav === to;

            return (
              <div
                key={to}
                className="relative"
                onMouseEnter={() => setHoveredNav(to)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {isHighlighted && (
                  <motion.span
                    layoutId="nav-highlight-pill"
                    className="desktop-header__nav-pill"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}

                <Link
                  to={to}
                  {...scrollProps}
                  className="desktop-header__nav-link"
                  onClick={() => beginScrollTo(to)}
                >
                  <span
                    className="desktop-header__nav-label"
                    style={{
                      color: isActive
                        ? "#7B96FF"
                        : isHighlighted && !isActive
                        ? "rgba(255,255,255,0.72)"
                        : "rgba(255,255,255,0.42)",
                    }}
                  >
                    {label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* ── Right: CTA ── */}
        <div className="justify-self-end">
          <Link
            to="contact"
            {...scrollProps}
            className="cursor-pointer"
            onClick={() => beginScrollTo("contact")}
          >
            <motion.button
              type="button"
              className="desktop-header__cta"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <span>Let&apos;s talk</span>
              <span className="desktop-header__cta-icon">
                <HiArrowUpRight size={13} color="#fff" />
              </span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
