import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import {
  canRestoreHomeScroll,
  clearHomeScroll,
  consumeHomeScroll,
  markExpectHomeRestore,
  restoreScrollPosition,
  scrollToWorkSection,
} from "../../utils/homeScroll";

/**
 * - Project routes: always open at the top.
 * - Home return via back link or browser back: restore saved scroll,
 *   otherwise land on the Work section.
 */
const RouteScrollHandler = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (location.pathname.startsWith("/projects")) {
      markExpectHomeRestore();
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    if (location.pathname === "/") {
      const wantsWork =
        location.state?.scrollTo === "work" || location.hash === "#work";

      const shouldRestore = canRestoreHomeScroll(
        navigationType,
        location.state?.restoreHomeScroll
      );

      if (shouldRestore) {
        const y = consumeHomeScroll();
        if (y != null) {
          restoreScrollPosition(y);
          return;
        }
      }

      clearHomeScroll();

      if (wantsWork) {
        scrollToWorkSection();
      }
    }
  }, [location.pathname, location.key, location.state, location.hash, navigationType]);

  return null;
};

export default RouteScrollHandler;
