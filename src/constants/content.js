import elloImage from "../assets/ello1.png";
import raffoulImage from "../assets/raffoulmotors.png";
import topSpeedImage from "../assets/Top_speed_apps/topspeedlogo.png";
import alterLogo from "../assets/alter_images/alter logo white .png";

export const SKILLS = [
  "React",
  "Flutter",
  "TypeScript",
  "React Native",
  "WordPress",
  "Node.js",
  "Tailwind CSS",
  "Android Studio",
  "Firebase",
  "Figma",
  "JavaScript",
  "Mobile Development",
];

export const ABOUT_STATS = [
  { value: 1.5, suffix: "+", label: "Years\nExperience", decimals: 1 },
  { value: 5, suffix: "+", label: "Projects\nCompleted" },
  { value: 4, suffix: "+", label: "Happy\nClients" },
];

export const SERVICES = [
  {
    id: "mobile",
    number: "01",
    name: "Mobile App Development",
    description:
      "Versatile Mobile App Developer skilled in Flutter for cross-platform excellence, along with React Native. I also bring platform-specific precision through Android Studio — shipping apps that feel native on every device.",
    tags: ["Flutter", "React Native", "Android"],
  },
  {
    id: "web",
    number: "02",
    name: "Web Development",
    description:
      "As a ReactJS specialist, I transform complex concepts into elegant, interactive web interfaces. With deep WordPress experience, I craft versatile, user-friendly websites that are both beautiful and highly performant.",
    tags: ["ReactJS", "WordPress", "Tailwind CSS"],
  },
];

export const PROJECTS_ALL = [
  {
    id: "ello",
    title: "Ello Café",
    category: "Mobile / Web Application E-learning",
    description:
      "A comprehensive e-learning platform accessible via both mobile and web. Features interactive courses, user progress tracking, and a responsive, intuitive interface for seamless learning across all devices.",
 
    image: elloImage,
    imageFit: "contain",
    caseStudyPath: "/projects/ello-cafe",
    liveHref: "https://ellos-new-website.vercel.app/",
    tag: "Web",
    accent: "violet",
    featured: true,
    showOnHome: true,
  },
  {
    id: "raffoul-motors",
    title: "Raffoul Motors",
    category: "Car Dealership Platform",
    description:
      "A bilingual dealership platform for a family-run pre-owned car showroom in South Lebanon. Full inventory browsing, car detail pages, workshop section, and a private admin panel.",
    image: raffoulImage,
    imageFit: "contain",
    caseStudyPath: "/projects/raffoul-motors",
    tag: "Web",
    accent: "cyan",
    showOnHome: true,
  },
  {
    id: "top-speed",
    title: "Top Speed",
    category: "Delivery Platform · Mobile Apps",
    description:
      "A dual-app delivery ecosystem for vendors and drivers. Vendors post and track orders; drivers receive push notifications, manage packages, and are GPS-tracked on duty. Built with Flutter, PHP, and Firebase.",
    image: topSpeedImage,
    imageFit: "contain",
    caseStudyPath: "/projects/top-speed",
    tag: "Mobile",
    accent: "violet",
    showOnHome: true,
  },
  {
    id: "alter",
    title: "Alter",
    category: "PR & Marketing Agency Website",
    description:
      "A premium React.js website for a MENA-region PR & marketing agency. Cinematic hero, live campaign stats, artist marquee, influencer showcase, and fully responsive mobile experience.",
    image: alterLogo,
    imageFit: "contain",
    mobileImagePadding: "14px 48px",
    caseStudyPath: "/projects/alter",
    liveHref: "https://altercoms.vercel.app/",
    tag: "Web",
    accent: "violet",
    showOnHome: true,
  },

];

export const PROJECTS = PROJECTS_ALL.filter((project) => !project.hidden);
export const HOME_PROJECTS = PROJECTS.filter((project) => project.showOnHome);
