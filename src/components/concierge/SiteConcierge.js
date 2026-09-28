import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { HiSparkles, HiXMark } from "react-icons/hi2";
import useConciergeTour from "../../hooks/useConciergeTour";
import { SCROLL_DURATION, SCROLL_OFFSET } from "../../constants";
import { saveHomeScroll } from "../../utils/homeScroll";
import ChatPanel, { useAssistantChat } from "./ChatPanel";
import TourHud from "./TourHud";
import "./concierge.css";

const isMobile = () => window.innerWidth < 768;

/** Floating AI assistant: chat about Mario, plus a guided tour of the page. */
const SiteConcierge = () => {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef(null);
  const navigate = useNavigate();
  const chat = useAssistantChat();
  const tour = useConciergeTour({ onFinish: () => setOpen(true) });

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);

  const startTour = () => {
    setOpen(false);
    chat.stopSpeaking();
    tour.start();
  };

  const openLink = (link) => {
    if (link.href.startsWith("#")) {
      scroller.scrollTo(link.href.slice(1), { smooth: true, duration: SCROLL_DURATION, offset: SCROLL_OFFSET });
      if (isMobile()) setOpen(false);
    } else {
      saveHomeScroll();
      navigate(link.href);
    }
  };

  return (
    <>
      <AnimatePresence>{tour.active && <TourHud key="tour" tour={tour} />}</AnimatePresence>

      {!tour.active && (
        <div className={`cc-dock${open ? " is-open" : ""}`}>
          <AnimatePresence>
            {open && (
              <motion.div
                key="backdrop"
                className="cc-backdrop"
                onClick={close}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
              />
            )}
            {open && (
              <ChatPanel key="panel" chat={chat} onClose={close} onStartTour={startTour} onLink={openLink} />
            )}
          </AnimatePresence>

          <button
            ref={launcherRef}
            type="button"
            className="cc-launcher"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="concierge-panel"
            aria-label={open ? "Close assistant" : "Ask AI about Mario"}
          >
            <span className="cc-launcher__icon" aria-hidden="true">
              {open ? <HiXMark /> : <HiSparkles />}
            </span>
            <span className="cc-launcher__text">Ask AI</span>
          </button>
        </div>
      )}
    </>
  );
};

export default SiteConcierge;
