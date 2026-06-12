import elloImage from "../assets/ello1.png";
import weatherImage from "../assets/weatherProjectPic.png";
import musicImage from "../assets/musicApp.png";
import travelmateImage from "../assets/travelmateProject.png";

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

export const PROJECTS = [
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
    id: "weather",
    title: "Weather App",
    category: "ReactJS Application",
    description:
      "Real-time weather app with geolocation, 5-day forecasts, and clean responsive UI.",
    image: weatherImage,
    href: "https://weather-or-not-tan.vercel.app/",
    tag: "Web",
    accent: "cyan",
    showOnHome: true,
  },
  {
    id: "music",
    title: "Music App",
    category: "Flutter Mobile App",
    description:
      "Cross-platform music streaming app built with Flutter — custom player UI and audio controls.",
    image: musicImage,
    tag: "Mobile",
    accent: "violet",
    showOnHome: true,
  },
  {
    id: "travelmate",
    title: "TravelMate",
    category: "University Project",
    description:
      "A travel companion app designed and built as a university capstone project.",
    image: travelmateImage,
    href: "https://csci390project.vercel.app/",
    tag: "Mobile",
    accent: "cyan",
    showOnHome: false,
  },
  {
    id: "music-demo",
    title: "Music App",
    category: "Flutter Mobile Application",
    description: "Interactive demo showcasing Flutter UI patterns and audio playback.",
    videoSrc:
      "https://dms-exp3.licdn.com/playlist/vid/D4E05AQFoZEAfsxt4Jg/mp4-720p-30fp-crf28/0/1687810398472?e=1693299600&v=beta&t=C2O6wiAfD5IOf9azlj9X9ULlHwK5QZuZb3Sk7WRduWc",
    tag: "Mobile",
    accent: "violet",
    showOnHome: false,
  },
  {
    id: "weather-android",
    title: "Weather App",
    category: "Android Mobile Application",
    description: "Native Android weather experience with location-aware forecasts.",
    videoSrc:
      "https://dms-exp3.licdn.com/playlist/vid/D4E05AQFlGD76Y4nEZw/mp4-720p-30fp-crf28/0/1690888407608?e=1693299600&v=beta&t=tRKHgibABRQPW9eeuCDTyl__skUklYgoAQr5kMHiSFI",
    tag: "Mobile",
    accent: "cyan",
    showOnHome: false,
  },
];

export const HOME_PROJECTS = PROJECTS.filter((project) => project.showOnHome);
