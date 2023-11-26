/* eslint-disable no-undef */
import Script from "next/script";
import { videoPath } from "@shared/utils/videos";

export const ScriptVideo = ({ setPlayer, packAnimation }) => {
  return (
    <Script
      src="https://unpkg.com/@esotericsoftware/spine-player@4.0.*/dist/iife/spine-player.js"
      onReady={() => {
        new spine.SpinePlayer("animation", {
          jsonUrl: `/animations/Json/${videoPath(packAnimation)}.json`,
          atlasUrl: `/animations/Json/${videoPath(packAnimation)}.atlas`,
          viewport: {
            x: -0,
            y: -1080,
            width: 1920,
            height: 1080,
            padLeft: "0%",
            padRight: "0%",
            padTop: "0%",
            padBottom: "0%",
          },
          showControls: true,
          backgroundColor: "#2d1541",
          success: function (player) {
            setPlayer(player);
          },
          error: function (player, reason) {
            alert(reason);
          },
        });
      }}
    ></Script>
  );
};
