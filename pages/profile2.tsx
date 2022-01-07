import { Typography } from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import "shared/firebase";

const Profile = () => {
  return (
    <ProfileLayoutComponent>
      <div className="flex flex-col border border-overlay-border p-4">
        <div>
          <Typography type="label" className="text-white text-5xl">
            0 ONE
          </Typography>
          <Typography type="title" className="text-primary">
            0 USD
          </Typography>
          <h1 className="text-5xl">A</h1>
        </div>
      </div>
    </ProfileLayoutComponent>
  );
};

export default Profile;
