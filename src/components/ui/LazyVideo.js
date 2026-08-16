import React, { useEffect, useRef, useState } from "react";

/**
 * Chromeless looping video that only downloads when near the viewport.
 * Poster (WebP) paints immediately — same dual-asset idea as Raffoul's
 * image / imageCard split.
 */
const CHROMELESS = {
  loop: true,
  muted: true,
  playsInline: true,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  controls: false,
  controlsList: "nodownload noplaybackrate noremoteplayback nofullscreen",
};

const LazyVideo = ({
  src,
  poster,
  className,
  style,
  eager = false,
  ...rest
}) => {
  const ref = useRef(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (eager) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "280px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eager]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return undefined;

    const play = () => el.play().catch(() => {});
    const onPause = () => {
      const rect = el.getBoundingClientRect();
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      if (onScreen) play();
    };

    play();
    el.addEventListener("pause", onPause);

    const vis = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else el.pause();
      },
      { threshold: 0.15 }
    );
    vis.observe(el);

    return () => {
      vis.disconnect();
      el.removeEventListener("pause", onPause);
    };
  }, [active, src]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      preload={eager ? "auto" : active ? "metadata" : "none"}
      className={className}
      style={style}
      onContextMenu={(e) => e.preventDefault()}
      {...CHROMELESS}
      {...rest}
    />
  );
};

export default LazyVideo;
