import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import Activities from "@shared/components/Profile/activities/activities";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

const ProfileActivities = () => {
  const { account } = useWeb3React();
  const { ethAddress } = useSelector((state: any) => state.layout.user);
  const router = useRouter();

  React.useEffect(() => {
    if (!account && !ethAddress) {
      router.push("/login");
    }
  }, [account, ethAddress]);
  return <Activities></Activities>;
};

export default ProfileActivities;
