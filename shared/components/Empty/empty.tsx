import { Icons } from "@shared/const/Icons";
import React from "react";

const Empty = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <img src={Icons.logo} className="h-24 w-24" alt="" />
      <h2 className="text-primary mt-10">Coming Soon</h2>
    </div>
  );
};

export default Empty;
