import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";

import { useRouter } from "next/router";
import Sales from "@shared/components/Profile/sales/sales";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

const ProfileInventory = () => {
  const { account: user } = useWeb3React();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <ProfileLayoutComponent>
      <Sales></Sales>
    </ProfileLayoutComponent>
  );
};

export default ProfileInventory;
