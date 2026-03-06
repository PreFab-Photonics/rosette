import { useEffect, useState } from "react";

/** Laser color matching rosette-web (#ff0000). */
const LASER_COLOR = "#ff0000";

/** Laser glow blur radius in pixels. */
const GLOW_BLUR = 4;

/**
 * Glowing cursor dot for the laser pointer tool.
 *
 * Follows the mouse cursor with a red glowing effect.
 * Positioned using CSS transforms for smooth performance.
 */
export function LaserCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: LASER_COLOR,
        boxShadow: `
          0 0 ${GLOW_BLUR}px ${LASER_COLOR},
          0 0 ${GLOW_BLUR * 2}px ${LASER_COLOR},
          0 0 ${GLOW_BLUR * 3}px ${LASER_COLOR}`,
        opacity: 0.9,
        left: 0,
        top: 0,
        transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
        willChange: "transform",
      }}
    />
  );
}
