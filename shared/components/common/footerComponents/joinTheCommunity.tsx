"use client";
import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";

export const JoinTheCommunity = () => {
  const icons = [
    {
      icon: "icons/Group 76.png",
      href: "https://discord.com/invite/nHNkWdE99h",
    },
    { icon: "icons/Group 77.png", href: "https://twitter.com/EndersGate" },
    {
      icon: "icons/Group 74.png",
      href: "https://youtube.com/channel/UCicr9XOX1EWwpzX3VPbm6kg",
    },
    { icon: "icons/Group 73.png", href: "https://www.endersgate.one/#" },
    {
      icon: "icons/Group 71.png",
      href: "https://www.instagram.com/endersgate/",
    },
    {
      icon: "icons/Group 75.png",
      href: "https://www.facebook.com/EndersGateTCG",
    },
    {
      icon: "icons/Group 78.png",
      href: "https://www.reddit.com/r/EndersGate/",
    },
    {
      icon: "icons/Group 72.png",
      href: "https://endersgate.gitbook.io/endersgate/",
    },
    // { icon: "icons/Group 79.png", href: "" },
  ];
  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center xl:py-10 py-6 gap-4 xl:px-10 px-4 border-t border-overlay-border bg-overlay-3",
      )}
    >
      <h2 className="font-bold text-xl text-white">Join the community</h2>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {icons.map(({ icon, href }) => (
          <a
            href={href}
            target="_blank"
            className="opacity-50 hover:opacity-100"
          >
            <img src={icon} className="w-16 h-16" />
          </a>
        ))}
      </div>
    </div>
  );
};
