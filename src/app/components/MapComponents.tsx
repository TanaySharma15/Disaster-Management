"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DynamicMap = dynamic(() => import("./MapComponentClient"), {
  ssr: false, // Disable SSR for this component
});

export default function MapComponent({ earthquakes }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <p>Loading Map...</p>;

  return <DynamicMap earthquakes={earthquakes} />;
}
