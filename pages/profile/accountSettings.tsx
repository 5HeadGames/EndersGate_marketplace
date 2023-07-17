import React from "react";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";
import ProfileIndexPage from "@shared/components/Profile/index";

const ProfileSettings = () => {
  return (
    <ProfileIndexPage>
      <AccountSettingsComponent />
    </ProfileIndexPage>
  );
};

export default ProfileSettings;
