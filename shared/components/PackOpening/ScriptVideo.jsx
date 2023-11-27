/* eslint-disable no-undef */
import Script from "next/script";
import React from "react";

export const ScriptVideo = ({ setSpine }) => {
  return (
    <Script
      src="https://unpkg.com/@esotericsoftware/spine-player@4.0.*/dist/iife/spine-player.js"
      onReady={() => {
        setSpine(spine);
      }}
    ></Script>
  );
};
