import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import Inventory from "@shared/components/Profile/inventory/inventory";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import ProfileIndexPage from "@shared/components/Profile/index";

const ProfileInventory = () => {
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
      <Inventory />
    </ProfileIndexPage>
  );
};

export default ProfileInventory;
