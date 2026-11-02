"use client";

import { useEffect, useState } from "react";

function getDateLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format()
    .toUpperCase();
}

export function TodayLabel() {
  const [label, setLabel] = useState("Today");

  useEffect(() => {
    const timer = window.setTimeout(() => setLabel(getDateLabel()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <p className="text-[0.65rem] font-semibold tracking-[0.24em] text-brand-terracotta dark:text-[#e0a48a]">
      {label}
    </p>
  );
}
