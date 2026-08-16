/**
 * Grounding data for the Role Fit Agent.
 * Keep this in sync with real projects / skills on the portfolio.
 */
module.exports = {
  candidate: {
    name: "Mario Nassar",
    role: "Mobile & Web Developer",
    location: "Lebanon / Remote-friendly",
    availability: "Available for work",
    email: "marionassar57@gmail.com",
    whatsapp: "+96181389885",
    summary:
      "Developer focused on shipping polished React web apps and Flutter / React Native mobile products. Strong at client work, bilingual UX, Firebase backends, and case-study-level product thinking.",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "Flutter",
      "React Native",
      "Firebase",
      "WordPress",
      "Node.js",
      "Tailwind CSS",
      "Android Studio",
      "Figma",
      "Mobile Development",
    ],
    strengths: [
      "End-to-end product delivery for real clients",
      "Cross-platform mobile (Flutter + React Native)",
      "Modern React UI with motion and strong visual craft",
      "Firebase auth, Firestore, and admin tooling",
      "Bilingual / MENA-market product experience",
    ],
  },
  projects: [
    {
      id: "ello",
      title: "Ello Café",
      category: "E-learning platform · Mobile + Web",
      stack: ["React", "Mobile", "Web", "E-learning UX"],
      impact:
        "Built a comprehensive e-learning experience across mobile and web with courses, progress tracking, and responsive UX.",
      proofPoints: [
        "Multi-surface product (mobile + web)",
        "Learner progress flows",
        "Production-facing UI polish",
      ],
      caseStudyPath: "/projects/ello-cafe",
      liveHref: "https://ellos-new-website.vercel.app/",
    },
    {
      id: "raffoul-motors",
      title: "Raffoul Motors",
      category: "Car dealership platform",
      stack: ["React", "Admin panel", "Bilingual UX", "Inventory systems"],
      impact:
        "Delivered a bilingual dealership platform for a South Lebanon showroom: inventory, detail pages, workshop section, and private admin.",
      proofPoints: [
        "Real client business tool",
        "Bilingual experience",
        "Admin + public site split",
      ],
      caseStudyPath: "/projects/raffoul-motors",
    },
    {
      id: "arabfiles",
      title: "ArabFiles News",
      category: "News · Flutter mobile app",
      stack: [
        "Flutter",
        "Riverpod",
        "GoRouter",
        "Dio",
        "Firebase Messaging",
        "RTL / bilingual",
      ],
      impact:
        "Shipped a production Flutter news client for a Lebanese/Arab media brand: RTL-first reading, bilingual UI, push deep links, and in-article YouTube playback against the live Arabfiles REST API.",
      proofPoints: [
        "Home feeds, categories, articles, and video section",
        "FCM breaking-news alerts with article deep links",
        "Clean architecture with Riverpod, GoRouter, and Dio",
      ],
      caseStudyPath: "/projects/arabfiles",
    },
    {
      id: "martix",
      title: "Martix",
      category: "Marketplace · Flutter customer app",
      stack: [
        "Flutter",
        "Firebase chat",
        "FCM",
        "Dio",
        "GetIt",
        "Drift cache",
      ],
      impact:
        "Shipped the live Martix customer app: multi-vendor shopping, checkout, orders, and realtime seller chat on Android (iOS-ready), integrated with martixstores.com.",
      proofPoints: [
        "Full shopping journey (browse → checkout → orders)",
        "Realtime customer–seller chat with read receipts",
        "Push, deep links, version gating, offline-friendly cache",
      ],
      caseStudyPath: "/projects/martix",
      liveHref: "https://martixstores.com/",
    },
    {
      id: "top-speed",
      title: "Top Speed",
      category: "Delivery platform · Dual mobile apps",
      stack: ["Flutter", "Firebase", "PHP", "Push notifications", "GPS"],
      impact:
        "Built a vendor + driver delivery ecosystem: order posting, push notifications, package management, and on-duty GPS tracking.",
      proofPoints: [
        "Two coordinated mobile apps",
        "Realtime ops with Firebase",
        "Location / notification systems",
      ],
      caseStudyPath: "/projects/top-speed",
    },
    {
      id: "alter",
      title: "Alter",
      category: "PR & marketing agency website",
      stack: ["React", "Framer Motion", "Responsive design", "Brand sites"],
      impact:
        "Shipped a cinematic React site for a MENA PR agency with hero storytelling, live stats, artist marquee, and responsive polish.",
      proofPoints: [
        "High-end marketing site craft",
        "Motion-led storytelling",
        "Agency brand presentation",
      ],
      caseStudyPath: "/projects/alter",
      liveHref: "https://altercoms.vercel.app/",
    },
  ],
};
