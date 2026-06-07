import { BiHomeAlt, BiUser } from "react-icons/bi";
import {
  BsBriefcase,
  BsChatSquareText,
  BsClipboardData,
} from "react-icons/bs";

export const SECTION_IDS = {
  home: "home",
  about: "about",
  services: "services",
  work: "work",
  contact: "contact",
};

/** Fixed floating header clearance (px) — passed to react-scroll as negative offset */
export const SCROLL_OFFSET = -92;

/** Nav click scroll duration (ms) — keep snappy */
export const SCROLL_DURATION = 420;

export const HEADER_NAV = [
  { label: "About", to: SECTION_IDS.about },
  { label: "Services", to: SECTION_IDS.services },
  { label: "Work", to: SECTION_IDS.work },
  { label: "Contact", to: SECTION_IDS.contact },
];

export const MOBILE_NAV = [
  { label: "Home", to: SECTION_IDS.home, Icon: BiHomeAlt, offset: -200 },
  { label: "About", to: SECTION_IDS.about, Icon: BiUser },
  { label: "Services", to: SECTION_IDS.services, Icon: BsClipboardData },
  { label: "Work", to: SECTION_IDS.work, Icon: BsBriefcase },
  { label: "Contact", to: SECTION_IDS.contact, Icon: BsChatSquareText },
];
