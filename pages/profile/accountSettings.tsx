import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";

const ProfileSettings = () => {
  const { account: user } = useWeb3React();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return <AccountSettingsComponent />;
};

export default ProfileSettings;
