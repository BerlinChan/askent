import { useState, useEffect } from "react";

export function useMouseMove(timeout: number = 5000) {
  const [mouseEvent, setMouseMove] = useState<MouseEvent | null>(null);
  const [mouseStop, setMouseStop] = useState<boolean>(true);
  let timer: number | null = null;

  const handleMouseMove = (event: MouseEvent) => {
    setMouseMove(event);
    setMouseStop(false);

    if (timer !== null) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      timer = null;
      setMouseStop(true);
    }, timeout);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mouseEvent, mouseStop };
}
