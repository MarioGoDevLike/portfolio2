import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import {
  canRestoreHomeScroll,
  clearHomeScroll,
  consumeHomeScroll,
  markExpectHomeRestore,
  restoreScrollPosition,
} from "../../utils/homeScroll";

/**
 * - Project routes: always open at the top.
 * - Home return via back link or browser back: restore saved scroll.
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
    }
  }, [location.pathname, location.key, location.state, navigationType]);

  return null;
};

export default RouteScrollHandler;
