/* eslint-disable no-undef */
import Script from "next/script";
import { videoPath } from "@shared/utils/videos";
import React from "react";

export const ScriptVideo = ({
  setPlayer0,
  setPlayer1,
  setPlayer2,
  setPlayer3,
  mobile = false,
}) => {
  return (
    <Script
      src="https://unpkg.com/@esotericsoftware/spine-player@4.0.*/dist/iife/spine-player.js"
      onReady={() => {
        console.log("spine");
        for (let i = 0; i < 4; i++) {
          new spine.SpinePlayer(`animation-${mobile ? `mobile-${i}` : i}`, {
            jsonUrl: `/animations/Json/${videoPath(i)}.json`,
            atlasUrl: `/animations/Json/${videoPath(i)}.atlas`,
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
            // eslint-disable-next-line no-loop-func
            success: function (player) {
              switch (i) {
                case 0:
                  setPlayer0(player);
                  break;
                case 1:
                  setPlayer1(player);
                  break;

                case 2:
                  setPlayer2(player);
                  break;

                case 3:
                  setPlayer3(player);
                  break;
                default:
              }
            },
            error: function (player, reason) {
              alert(reason);
            },
          });
        }
      }}
    ></Script>
  );
};
