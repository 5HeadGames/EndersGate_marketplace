import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import Activities from "@shared/components/Profile/activities/activities";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

const ProfileActivities = () => {
  const { account: user } = useWeb3React();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);
  return (
    <ProfileLayoutComponent>
      <Activities></Activities>
    </ProfileLayoutComponent>
  );
};

export default ProfileActivities;
