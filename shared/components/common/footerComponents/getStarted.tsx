import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";

export const GetStarted = () => {
  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center xl:py-10 py-6 gap-4 px-10 border-t border-overlay-border bg-overlay-3",
      )}
    >
      <h2 className="text-white text-xl font-bold">
        It's <span className="text-red-primary">easy</span> to get started!
        Here's how,
      </h2>
      <div className="flex flex-wrap">
        <div className="flex flex-col gap-2">
          <img src="/icons/getStarted2.svg" className="w-10" alt="" />
        </div>
      </div>
    </div>
  );
};
