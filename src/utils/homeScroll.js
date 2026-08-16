import { SCROLL_OFFSET } from "../constants";

const SCROLL_KEY = "portfolio:homeScrollY";
const PENDING_KEY = "portfolio:homeScrollPending";
const EXPECT_RESTORE_KEY = "portfolio:expectHomeRestore";

/** Call before navigating from the home page to a project. */
export function saveHomeScroll() {
  if (typeof window === "undefined" || window.location.pathname !== "/") return;
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  sessionStorage.setItem(PENDING_KEY, "1");
}

/** React Router `to` target for back-to-home (Work section). */
export function getHomeBackLink() {
  return { pathname: "/", hash: "#work" };
}

/** Must be passed as Link's separate `state` prop (not nested in `to`). */
export function getHomeBackState() {
  return { restoreHomeScroll: true, scrollTo: "work" };
}

export function hasPendingHomeScroll() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PENDING_KEY) === "1";
}

export function clearHomeScroll() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SCROLL_KEY);
  sessionStorage.removeItem(PENDING_KEY);
  sessionStorage.removeItem(EXPECT_RESTORE_KEY);
}

/** Mark that the user opened a project after leaving home (enables browser-back restore). */
export function markExpectHomeRestore() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(EXPECT_RESTORE_KEY, "1");
}

function shouldExpectHomeRestore() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(EXPECT_RESTORE_KEY) === "1";
}

export function canRestoreHomeScroll(navigationType, restoreFlag) {
  if (!hasPendingHomeScroll()) return false;
  if (restoreFlag === true) return true;
  // POP = browser back; PUSH = in-app "Back to home" link
  return (
    shouldExpectHomeRestore() &&
    (navigationType === "POP" || navigationType === "PUSH")
  );
}

/** Read and clear saved scroll position when restoring. */
export function consumeHomeScroll() {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SCROLL_KEY);
  sessionStorage.removeItem(SCROLL_KEY);
  sessionStorage.removeItem(PENDING_KEY);
  sessionStorage.removeItem(EXPECT_RESTORE_KEY);
  if (raw == null) return null;
  const y = parseInt(raw, 10);
  return Number.isFinite(y) ? y : null;
}

export function restoreScrollPosition(y) {
  if (typeof window === "undefined" || y == null) return;
  const apply = () => window.scrollTo({ top: y, left: 0 });
  apply();
  requestAnimationFrame(apply);
  setTimeout(apply, 0);
  setTimeout(apply, 80);
  setTimeout(apply, 200);
}

/** Scroll home to the Work / projects section (header-aware). */
export function scrollToWorkSection() {
  if (typeof window === "undefined") return;
  const apply = () => {
    const el = document.getElementById("work");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), left: 0 });
  };
  apply();
  requestAnimationFrame(apply);
  setTimeout(apply, 0);
  setTimeout(apply, 80);
  setTimeout(apply, 200);
}
