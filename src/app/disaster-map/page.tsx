"use client";

import dynamic from "next/dynamic";

// Dynamically import the full-page map component (client-side only)
const FullPageMap = dynamic(() => import("@/app/components/FullMap"), {
  ssr: false,
});

export default function DisasterMapPage() {
  return (
    <div className="h-screen w-screen">
      {/* Optionally, you can add a header or navigation overlay here */}
      <FullPageMap />
    </div>
  );
}
