import Script from "next/script";
import React from "react";
import { SpinePlayer } from "@esotericsoftware/spine-player";

export default function Home() {
  if (typeof window !== "undefined") {
    const spine = new SpinePlayer("testing", {
      // Relative URLs
      jsonUrl: "/animations/Json/Epic_Pack_Gen0/Epic_Pack_Gen0.json",
      atlasUrl: "/animations/Json/Epic_Pack_Gen0/Epic_Pack_Gen0.atlas",
      viewport: {
        width: 100,
        height: 500,
      },
      preserveDrawingBuffer: true,
    });
  }
  return (
    <div className="h-[100vh] w-[100vw] overflow-hidden">
      <div id="testing" className="h-[100vh] w-[100vw]"></div>
    </div>
  );
}
