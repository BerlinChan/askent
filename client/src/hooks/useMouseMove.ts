import { useState, useEffect } from "react";

export function useMouseMove() {
  const [mouseMove, setMouseMove] = useState<MouseEvent | null>(null);
  const handleMouseMove = (event: MouseEvent) => {
    setMouseMove(event);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return mouseMove;
}
