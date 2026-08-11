/**
 * Single guided tour stops.
 * Medium-length lines: clear, human, and confident about Mario’s work.
 */
module.exports = [
  {
    id: "home",
    selector: '[data-tour="home"]',
    fallbackSelector: "#home",
    label: "Opening",
    line:
      "This opening shows how Mario works — clean design, smooth motion, and a strong first impression that feels intentional from the start.",
  },
  {
    id: "about",
    selector: '[data-tour="about"]',
    fallbackSelector: "#about",
    label: "About",
    line:
      "Here you’ll meet Mario: a mobile and web developer who cares about craft. He builds with React, Flutter, and Firebase, and focuses on work that holds up in the real world.",
  },
  {
    id: "services",
    selector: '[data-tour="services"]',
    fallbackSelector: "#services",
    label: "Services",
    line:
      "Mario covers both mobile and web with the same level of care — clear structure, solid code, and products that are easy for clients and users to trust.",
  },
  {
    id: "work",
    selector: '[data-tour="work"]',
    fallbackSelector: "#work",
    label: "Work",
    line:
      "These projects show what he can do for real businesses — from delivery apps to polished websites. Each one is built thoughtfully, not just for show.",
  },
  {
    id: "work-featured",
    selector: '[data-tour="work-featured"]',
    fallbackSelector: "#work",
    label: "Featured project",
    line:
      "This featured piece is a good look at Mario’s standard: he owns the full build and finishes with a product that feels polished and ready to use.",
  },
  {
    id: "contact",
    selector: '[data-tour="contact"]',
    fallbackSelector: "#contact",
    label: "Contact",
    line:
      "If you’re looking for someone reliable and professional, this is the easy next step. Mario is available and usually replies quickly.",
  },
];
