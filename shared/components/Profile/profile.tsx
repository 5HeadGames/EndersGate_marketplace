import React from "react";
import ProfileDataAndActions from "./profilePersonalData/profilePersonalData";

const ProfileLayoutComponent = ({children}) => {
  return (
    <div className="flex w-full ">
      <aside className="md:flex hidden flex-col pt-32 pr-8 h-screen w-72 border-r border-overlay-border">
        <ProfileDataAndActions />
      </aside>
      <div className="w-full pt-28 md:px-4 min-h-screen">{children}</div>
    </div>
  );
};

export default ProfileLayoutComponent;
