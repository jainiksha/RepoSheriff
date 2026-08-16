"use client";

import { useEffect, useRef } from "react";

export default function CursorSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      const dx = clientX - lastPosition.current.x;
      const dy = clientY - lastPosition.current.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 8) return;

      lastPosition.current = {
        x: clientX,
        y: clientY,
      };

      // Create 2–3 sparkles at a time
      const sparkleCount = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement("span");

        const size = Math.random() * 7 + 5;
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        const rotation = Math.random() * 90;

        // Mix stars and dots
        const symbols = ["✦", "✧", "⋆", "·"];
        sparkle.innerHTML =
          symbols[Math.floor(Math.random() * symbols.length)];

        sparkle.style.position = "fixed";
        sparkle.style.left = `${clientX + offsetX}px`;
        sparkle.style.top = `${clientY + offsetY}px`;

        sparkle.style.fontSize = `${size}px`;

        // Yellow + white sparkle effect
        sparkle.style.color =
          Math.random() > 0.35 ? "#ffc515" : "#fff8dc";

        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "9999";

        sparkle.style.transform =
          `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;

        sparkle.style.opacity = "1";

        sparkle.style.textShadow =
          "0 0 6px rgba(255, 197, 21, 0.8)";

        sparkle.style.transition =
          "opacity 750ms ease-out, transform 750ms ease-out";

        container.appendChild(sparkle);

        requestAnimationFrame(() => {
          sparkle.style.opacity = "0";

          sparkle.style.transform =
            `translate(-50%, -90%) rotate(${rotation + 60}deg) scale(0.2)`;
        });

        setTimeout(() => {
          sparkle.remove();
        }, 800);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}