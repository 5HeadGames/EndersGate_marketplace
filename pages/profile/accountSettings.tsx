import ProfileLayoutComponent from "@shared/components/Profile/profile";

import React from "react";
import { useRouter } from "next/router";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

const ProfileSettings = () => {
  const { account: user } = useWeb3React();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
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
