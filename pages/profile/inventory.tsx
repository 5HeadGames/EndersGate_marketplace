import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import Inventory from "@shared/components/Profile/inventory/inventory";
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
      <Inventory></Inventory>
    </ProfileLayoutComponent>
  );
};

export default ProfileInventory;
