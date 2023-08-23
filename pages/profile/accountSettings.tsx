import React from "react";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";
import ProfileLayout from "@shared/components/Profile/layout";

const ProfileSettings = () => {
  return (
    <ProfileLayout>
      <AccountSettingsComponent />
    </ProfileLayout>
  );
};

export default ProfileSettings;
