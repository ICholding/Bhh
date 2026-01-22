import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from '@/utils';

export default function Splash() {
  const nav = useNavigate();
  const [p, setP] = useState(1);
  const raf = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    // If already shown once this session, skip
    if (sessionStorage.getItem("bhh_splash_done") === "1") {
      nav(createPageUrl('Landing'), { replace: true });
      return;
    }

    const DURATION_MS = 2600; // 2.6s total

    const tick = (t) => {
      if (!start.current) start.current = t;
      const elapsed = t - start.current;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const value = Math.max(1, Math.floor(progress * 100));

      setP(value);

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("bhh_splash_done", "1");
        nav(createPageUrl('Landing'), { replace: true });
      }
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [nav]);

  return (
    <div style={styles.wrap}>
      <div style={styles.overlay} />

      <div style={styles.bottom}>
        <div style={styles.percent}>{p}%</div>

        <div style={styles.barTrack}>
          <div style={{ ...styles.barFill, width: `${p}%` }} />
        </div>

        <div style={styles.micro}>Loading…</div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    height: "100vh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    backgroundImage: "url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/ce26c3cbe_2f5a10156_6fbeeaeee_file_00000000936071f5b7d2ecf4d22a9f66.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 32,
    padding: "0 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  percent: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e5a9e",
    letterSpacing: "0.5px",
  },
  barTrack: {
    width: "100%",
    maxWidth: 320,
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.4)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #1e5a9e, #3b9fd4)",
    transition: "width 60ms linear",
  },
  micro: {
    fontSize: 13,
    fontWeight: 500,
    color: "#1e5a9e",
    opacity: 0.8,
  },
};
