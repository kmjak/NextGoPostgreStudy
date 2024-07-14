
"use client";

import { useState, useEffect } from "react";

export const MyStatusComponent = () => {
  const [mode, setMode] = useState<string>("active");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetMode = () => {
      setMode("stop");
    };

    const handleMouseMove = () => {
      setMode("active");
      clearTimeout(timer);
      timer = setTimeout(resetMode, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="my-status-contain">
      <div className={`my-icon ${mode}`}></div>
      <p className="my-name">My Name</p>
    </section>
  );
};