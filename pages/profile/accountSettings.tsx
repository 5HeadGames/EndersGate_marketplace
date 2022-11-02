import ProfileLayoutComponent from "@shared/components/Profile/profile";

import React from "react";
import { useRouter } from "next/router";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";

const ProfileSettings = () => {
  const { user } = useMagicLink();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !user.ethAddress) {
      router.push("/login");
    }
  }, [user]);

  return (
    <ProfileLayoutComponent>
      <AccountSettingsComponent />
    </ProfileLayoutComponent>
  );
};

export default ProfileSettings;
