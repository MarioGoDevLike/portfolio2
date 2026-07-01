const SCROLL_KEY = "portfolio:homeScrollY";
const PENDING_KEY = "portfolio:homeScrollPending";
const EXPECT_RESTORE_KEY = "portfolio:expectHomeRestore";

/** Call before navigating from the home page to a project. */
export function saveHomeScroll() {
  if (typeof window === "undefined" || window.location.pathname !== "/") return;
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  sessionStorage.setItem(PENDING_KEY, "1");
}

/** Link target for "Back to home" — restores saved scroll on arrival. */
export function getHomeBackLink() {
  return { pathname: "/", state: { restoreHomeScroll: true } };
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
  return navigationType === "POP" && shouldExpectHomeRestore();
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
