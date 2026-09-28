/**
 * Case study content. Every project detail page is rendered by
 * components/project/CaseStudy from one entry here.
 *
 * showcase.device: "browser" | "phone"
 * showcase media:  `screens` (image gallery) or `video` ({ src, poster })
 * highlights with `idx` jump the gallery to that screen.
 */

/* Ello Café */
import elloAppWelcome from "../assets/ello_app_images/unlogged page.webp";
import elloAppHome from "../assets/ello_app_images/Home page.webp";
import elloAppSignUp from "../assets/ello_app_images/sign up page.webp";
import elloAppCourse from "../assets/ello_app_images/Course page.webp";
import elloAppInstructor from "../assets/ello_app_images/instructor page.webp";
import elloAppSessions from "../assets/ello_app_images/my sessions page.webp";
import elloWebHome from "../assets/ello_website_images/home page.webp";
import elloWebTeachers from "../assets/ello_website_images/teachers page.webp";
import elloWebCourses from "../assets/ello_website_images/courses page.webp";
import elloWebProfile1 from "../assets/ello_website_images/teacher profile 1.webp";
import elloWebProfile2 from "../assets/ello_website_images/teacher profile 2.webp";
import elloWebBook from "../assets/ello_website_images/book page.webp";
import elloWebStudentDash from "../assets/ello_website_images/student dashboard.webp";
import elloWebTeacherDash from "../assets/ello_website_images/teachers dashboard.webp";
import elloWebCourseDetail from "../assets/ello_website_images/course details 1.webp";

/* Raffoul Motors */
import rmWebHome1 from "../assets/raffoul_motors_web/home_page_1.webp";
import rmWebHome2 from "../assets/raffoul_motors_web/home_page_2.webp";
import rmWebCars from "../assets/raffoul_motors_web/available_cars_page.webp";
import rmWebWorkshop from "../assets/raffoul_motors_web/workshop_page.webp";
import rmWebDash from "../assets/raffoul_motors_web/dashboard_page_1.webp";
import rmMobHome from "../assets/raffoul_motors_web/mobile_view_home_page.webp";
import rmMobCars from "../assets/raffoul_motors_web/mobile_view_available_cars.webp";
import rmMobWorkshop from "../assets/raffoul_motors_web/mobile_view_workshop_cars.webp";
import rmMobDash from "../assets/raffoul_motors_web/mobile_view_dashboard.webp";
import raffoulLogo from "../assets/raffoulmotors.webp";

/* ArabFiles */
import arabFilesLogo from "../assets/Arabfiles/arab-files-logo.webp";
import arabFilesVideo from "../assets/Arabfiles/arabfiles.mp4";
import arabFilesPoster from "../assets/Arabfiles/arabfiles.poster.webp";

/* Martix */
import martixLogo from "../assets/Martix/martix-logo-2.webp";
import martixVideo from "../assets/Martix/martix stores.mp4";
import martixPoster from "../assets/Martix/martix stores.poster.webp";

/* Top Speed */
import tsVendorDashboard from "../assets/Top_speed_apps/vendor_dashboard_page.webp";
import tsVendorAddOrder from "../assets/Top_speed_apps/vendor_addorder_page.webp";
import tsVendorOrders from "../assets/Top_speed_apps/vendor_orders_page.webp";
import tsVendorSettings from "../assets/Top_speed_apps/vendor_settings_page.webp";
import tsDriverLogin from "../assets/Top_speed_apps/driver_login_page.webp";
import tsDriverDashboard from "../assets/Top_speed_apps/driver_dashboard_page.webp";
import tsDriverArchive from "../assets/Top_speed_apps/driver_archive_page.webp";
import tsDriverSettings from "../assets/Top_speed_apps/driver_settings_page.webp";
import topSpeedLogo from "../assets/Top_speed_apps/topspeedlogo.webp";

/* Alter */
import alterWebVideo from "../assets/alter_images/alter_web_view.mp4";
import alterMobileVideo from "../assets/alter_images/alter_mobile_view.mp4";
import alterWebPoster from "../assets/alter_images/alter_web_view.poster.webp";
import alterMobilePoster from "../assets/alter_images/alter_mobile_view.poster.webp";
import alterLogo from "../assets/alter_images/alter logo white .webp";

export const CASE_STUDIES = [
  {
    slug: "ello-cafe",
    title: "Ello Café",
    category: "E-learning · Web & Mobile",
    accent: "#5ECFB1",
    summary:
      "A full-stack ed-tech ecosystem connecting students with verified instructors — one product across web and mobile, built solo from design to deployment.",
    liveUrl: "https://ellos-new-website.vercel.app/",
    liveLabel: "Visit live site",
    meta: [
      { label: "Role", value: "Full-Stack Developer" },
      { label: "Type", value: "Web + Mobile" },
      { label: "Stack", value: "React · RN · Firebase" },
      { label: "Year", value: "2024" },
    ],
    showcases: [
      {
        id: "web",
        device: "browser",
        eyebrow: "Web Platform",
        title: "The Website",
        description:
          "A React.js platform where students book sessions, track progress, and message instructors — with separate dashboards for teachers too.",
        url: "ellos-new-website.vercel.app",
        screens: [
          { src: elloWebHome, label: "Homepage" },
          { src: elloWebTeachers, label: "Teachers" },
          { src: elloWebCourses, label: "Courses" },
          { src: elloWebCourseDetail, label: "Course Detail" },
          { src: elloWebProfile1, label: "Teacher Profile" },
          { src: elloWebProfile2, label: "Profile Details" },
          { src: elloWebBook, label: "Booking Flow" },
          { src: elloWebStudentDash, label: "Student Dashboard" },
          { src: elloWebTeacherDash, label: "Teacher Dashboard" },
        ],
      },
      {
        id: "app",
        device: "phone",
        eyebrow: "Mobile App",
        title: "React Native · iOS & Android",
        description: "Cross-platform mobile app with booking, messaging, and session tracking.",
        screens: [
          { src: elloAppWelcome, label: "Welcome" },
          { src: elloAppHome, label: "Explore" },
          { src: elloAppSignUp, label: "Join Ello" },
          { src: elloAppCourse, label: "Course Detail" },
          { src: elloAppInstructor, label: "Instructor" },
          { src: elloAppSessions, label: "My Sessions" },
        ],
        highlights: [
          { idx: 0, label: "Onboarding", desc: "Smooth first-launch experience with role selection" },
          { idx: 1, label: "Course Discovery", desc: "Browse instructors by subject, rating, and availability" },
          { idx: 3, label: "Booking Flow", desc: "Select sessions, pick packages, pay with Stripe" },
          { idx: 5, label: "Session Tracker", desc: "Track all upcoming and past sessions in one place" },
        ],
      },
    ],
    stack: {
      title: "Built with",
      groups: [
        { category: "Frontend", items: ["React.js", "Tailwind CSS", "React Router"] },
        { category: "Mobile", items: ["React Native", "Expo", "React Navigation"] },
        { category: "Backend", items: ["Firebase", "Node.js", "Stripe API"] },
      ],
    },
  },

  {
    slug: "raffoul-motors",
    title: "Raffoul Motors",
    category: "Car Dealership Platform",
    accent: "#E31E24",
    logo: { src: raffoulLogo },
    summary:
      "A bilingual automotive platform that put a premium Lebanese car dealer online — full inventory management, workshop listings, and an admin panel with zero code required.",
    meta: [
      { label: "Role", value: "Full-Stack Developer" },
      { label: "Type", value: "Web Platform" },
      { label: "Stack", value: "React · Firebase · TS" },
      { label: "Language", value: "Arabic & English" },
    ],
    showcases: [
      {
        id: "web",
        device: "browser",
        eyebrow: "Desktop Website",
        title: "The Website",
        description:
          "Full inventory browsing, car detail pages, workshop listings, and a zero-code admin panel — bilingual Arabic and English.",
        url: "raffoulmotors.com",
        screens: [
          { src: rmWebHome1, label: "Home — Hero" },
          { src: rmWebHome2, label: "Home — Showroom" },
          { src: rmWebCars, label: "Available Cars" },
          { src: rmWebWorkshop, label: "Workshop" },
          { src: rmWebDash, label: "Admin Dashboard" },
        ],
      },
      {
        id: "mobile",
        device: "phone",
        eyebrow: "Responsive Design",
        title: "Mobile Experience",
        description: "Every page adapts perfectly — inventory, workshop, and admin on any device.",
        screens: [
          { src: rmMobHome, label: "Mobile Home" },
          { src: rmMobCars, label: "Available Cars" },
          { src: rmMobWorkshop, label: "Workshop" },
          { src: rmMobDash, label: "Admin View" },
        ],
        highlights: [
          { idx: 0, label: "Mobile Home", desc: "Full hero experience adapts perfectly on every device" },
          { idx: 1, label: "Car Listings", desc: "Responsive inventory grid with filters — swipe-friendly on mobile" },
          { idx: 2, label: "Workshop", desc: "Workshop inventory fully accessible on mobile" },
          { idx: 3, label: "Admin Panel", desc: "Owners can manage listings from their phone too" },
        ],
      },
    ],
    stack: {
      title: "Built with",
      groups: [
        { category: "Frontend", items: ["React 18", "TypeScript", "Tailwind CSS", "i18next"] },
        { category: "Backend", items: ["Firebase", "Firestore", "Cloud Storage"] },
        { category: "Tooling", items: ["Vite", "Figma", "ESLint"] },
      ],
    },
  },

  {
    slug: "arabfiles",
    title: "ArabFiles News",
    category: "News · Flutter Mobile App",
    accent: "#E11D2E",
    logo: { src: arabFilesLogo, surface: "light" },
    summary:
      "Arabfiles is a production Flutter news client built for a Lebanese/Arab media brand. It delivers a fast, RTL-first reading experience with home feeds, category browsing, article details, and a dedicated video section — all powered by the live Arabfiles REST API.",
    meta: [
      { label: "Role", value: "Flutter Developer" },
      { label: "Platform", value: "iOS & Android" },
      { label: "Stack", value: "Flutter · Riverpod · Dio" },
      { label: "Type", value: "News Client" },
    ],
    showcases: [
      {
        id: "app",
        device: "phone",
        eyebrow: "Flutter News App",
        title: "News Client",
        description:
          "Feeds, categories, articles, video, and push deep links — built for bilingual, RTL-first reading.",
        video: { src: arabFilesVideo, poster: arabFilesPoster },
        highlights: [
          { label: "Read", desc: "Home feeds, category browsing, and polished article details" },
          { label: "Watch", desc: "Dedicated video section and native-style YouTube in articles" },
          { label: "Alert", desc: "FCM push for breaking news with deep links into stories" },
          { label: "Localize", desc: "Arabic RTL and English UI that matches the brand" },
        ],
      },
    ],
    stack: {
      eyebrow: "Stack & Craft",
      title: "Clean architecture, client-ready UI",
      description:
        "Built as a freelance client project with a focus on clean architecture, localization, and a polished mobile UI that matches the brand.",
      groups: [
        { category: "Mobile", items: ["Flutter", "Dart", "iOS & Android"] },
        { category: "App layer", items: ["Riverpod", "GoRouter", "Dio REST"] },
        { category: "Platform", items: ["Firebase Messaging", "YouTube playback", "RTL / bilingual"] },
      ],
      capabilities: [
        "Flutter (iOS/Android)",
        "Riverpod — state management",
        "GoRouter — navigation & deep links",
        "Dio — REST API client",
        "Firebase Messaging — push + article deep linking",
        "Bilingual UI — Arabic (RTL) / English",
        "Video — YouTube stream playback in-article",
      ],
    },
  },

  {
    slug: "martix",
    title: "Martix",
    category: "Marketplace · Flutter Customer App",
    accent: "#22D3EE",
    logo: { src: martixLogo },
    summary:
      "Martix is a live multi-vendor marketplace where customers discover stores, buy products, and talk directly to sellers. I built the Flutter customer app that ships that experience on Android (iOS-ready), integrated against martixstores.com.",
    liveUrl: "https://martixstores.com/",
    liveLabel: "Visit marketplace",
    meta: [
      { label: "Role", value: "Flutter Developer" },
      { label: "Platform", value: "Android · iOS-ready" },
      { label: "Stack", value: "Flutter · Firebase · Dio" },
      { label: "Type", value: "Marketplace App" },
    ],
    showcases: [
      {
        id: "app",
        device: "phone",
        eyebrow: "Flutter Customer App",
        title: "The shopping journey",
        description:
          "Customers can browse categories and flash deals, open storefronts, search products, check out, manage addresses and orders, leave reviews, and message sellers in realtime — with push, deep links, and remote update controls behind the scenes.",
        video: { src: martixVideo, poster: martixPoster },
        highlights: [
          { label: "Discover", desc: "Categories, flash deals, search, and storefront browsing" },
          { label: "Buy", desc: "Product details, cart, checkout, and saved addresses" },
          { label: "Follow up", desc: "Orders, reviews, and a realtime chat inbox with sellers" },
          { label: "Ship ready", desc: "Auth options, RTL localization, push, and remote update screens" },
        ],
      },
    ],
    stack: {
      eyebrow: "Stack & Structure",
      title: "Built to stay maintainable",
      description:
        "Features follow a consistent controller → service → repository pattern, with centralized API constants, Dio auth headers, and dependency injection via GetIt — so a large feature set stayed shippable while production fixes landed around auth edge cases, chat reliability, and Play Store link verification.",
      groups: [
        { category: "Mobile", items: ["Flutter", "Dart", "Android (iOS-ready)"] },
        { category: "Realtime & Auth", items: ["Firebase Chat", "FCM", "OTP · Google · Facebook"] },
        { category: "Architecture", items: ["GetIt DI", "Dio", "Drift cache", "Controller → Service → Repository"] },
      ],
      capabilities: [
        "Multi-vendor marketplace UX (stores, products, deals, checkout)",
        "Realtime customer–seller chat (Firebase)",
        "FCM push + deep links / App Links",
        "Auth: phone OTP, email, Google/Facebook",
        "Localization + RTL",
        "Offline-friendly caching + remote update screen",
      ],
    },
  },

  {
    slug: "top-speed",
    title: "Top Speed",
    category: "Delivery Platform · Mobile Apps",
    accent: "#DC1F26",
    logo: { src: topSpeedLogo, blend: true },
    summary:
      "Two dedicated Flutter apps — one for vendors, one for drivers — coordinating real-time deliveries with Firebase push notifications and live GPS tracking.",
    meta: [
      { label: "Role", value: "Mobile Developer" },
      { label: "Platform", value: "Flutter · iOS & Android" },
      { label: "Backend", value: "Firebase · PHP" },
      { label: "Type", value: "Dual-App System" },
    ],
    showcases: [
      {
        id: "vendor",
        device: "phone",
        eyebrow: "App One",
        title: "Vendor App",
        description: "Flutter · for business owners and dispatchers",
        screens: [
          { src: tsVendorDashboard, label: "Dashboard" },
          { src: tsVendorAddOrder, label: "Add Order" },
          { src: tsVendorOrders, label: "Orders" },
          { src: tsVendorSettings, label: "Settings" },
        ],
        highlights: [
          { idx: 0, label: "Dashboard", desc: "Order summary with live pending, active, delivered counters" },
          { idx: 1, label: "Add Order", desc: "Create a delivery with destination, package info, and priority" },
          { idx: 2, label: "Orders", desc: "Full order list with real-time status updates" },
          { idx: 3, label: "Settings", desc: "Profile and notification preferences" },
        ],
      },
      {
        id: "driver",
        device: "phone",
        eyebrow: "App Two",
        title: "Driver App",
        description: "Flutter · for delivery drivers on the road",
        screens: [
          { src: tsDriverLogin, label: "Login" },
          { src: tsDriverDashboard, label: "Dashboard" },
          { src: tsDriverArchive, label: "Archive" },
          { src: tsDriverSettings, label: "Settings" },
        ],
        highlights: [
          { idx: 0, label: "Login", desc: "Secure driver authentication flow" },
          { idx: 1, label: "Dashboard", desc: "Active orders and GPS tracking toggle" },
          { idx: 2, label: "Archive", desc: "Completed deliveries history view" },
          { idx: 3, label: "Settings", desc: "Driver profile and language settings" },
        ],
      },
    ],
    stack: {
      title: "Built with",
      groups: [
        { category: "Mobile", items: ["Flutter", "Dart", "Google Maps SDK"] },
        { category: "Backend", items: ["Firebase", "Firestore", "FCM Push"] },
        { category: "Tooling", items: ["PHP API", "Figma", "Git"] },
      ],
    },
  },

  {
    slug: "alter",
    title: "Alter",
    category: "PR & Marketing Agency Website",
    accent: "#C4A574",
    logo: { src: alterLogo },
    summary:
      "A cinematic digital presence for a leading MENA PR & marketing agency — built in React.js with live campaign statistics, a marquee artist roster, and a fully responsive layout.",
    liveUrl: "https://altercoms.vercel.app/",
    liveLabel: "Visit live site",
    meta: [
      { label: "Role", value: "Frontend Developer" },
      { label: "Client", value: "Alter Agency — MENA" },
      { label: "Stack", value: "React.js · Vercel" },
      { label: "Type", value: "Marketing Website" },
    ],
    showcases: [
      {
        id: "web",
        device: "browser",
        eyebrow: "Desktop Experience",
        title: "The Website",
        description:
          "The desktop opens with a bold hero, live campaign metrics, a marquee artist roster, and a cinematic scroll experience that communicates prestige and scale.",
        url: "altercoms.vercel.app",
        video: { src: alterWebVideo, poster: alterWebPoster },
      },
      {
        id: "mobile",
        device: "phone",
        eyebrow: "Responsive Design",
        title: "Mobile Experience",
        description:
          "The same cinematic content collapses into a clean, thumb-friendly mobile layout — every scroll interaction, stat counter, and marquee preserved at any screen size.",
        video: { src: alterMobileVideo, poster: alterMobilePoster },
        highlights: [
          { label: "Stats Hero", desc: "Live campaign and artist counts, full-width on mobile" },
          { label: "Artist Roster", desc: "Marquee scrolls and talent cards adapt to touch" },
          { label: "Service Grid", desc: "Six pillars stack cleanly for mobile reading" },
          { label: "Partners Wall", desc: "Logo grid reflows to 2-column on small screens" },
        ],
      },
    ],
    stack: {
      title: "Built with",
      groups: [
        { category: "Frontend", items: ["React.js", "JavaScript", "CSS3 Animations"] },
        { category: "Design", items: ["Figma", "Custom Typography", "Motion Design"] },
        { category: "Deploy", items: ["Vercel", "Performance CDN", "Responsive Grid"] },
      ],
    },
  },
];

export const getCaseStudy = (slug) => CASE_STUDIES.find((c) => c.slug === slug);
