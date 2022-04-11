import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import ProfileIndexPage from "@shared/components/Profile/index";

const Profile = () => {
  return (
    <ProfileLayoutComponent>
      <ProfileIndexPage />
    </ProfileLayoutComponent>
  );
};

export default Profile;
