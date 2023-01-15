import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";

import { useRouter } from "next/router";
import Sales from "@shared/components/Profile/sales/sales";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import ProfileIndexPage from "@shared/components/Profile/index";

const ProfileSales = () => {
  const { account } = useWeb3React();
  const { ethAddress } = useSelector((state: any) => state.layout.user);
  const router = useRouter();

  React.useEffect(() => {
    if (!account && !ethAddress) {
      router.push("/login");
    }
  }, [account, ethAddress]);
  return (
    <ProfileIndexPage>
      <Sales />
    </ProfileIndexPage>
  );
};

export default ProfileSales;
