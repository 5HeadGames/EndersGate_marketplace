import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import {useMoralis} from "react-moralis";
import {useRouter} from "next/router";
import Inventory from "@shared/components/Profile/inventory/inventory";

const ProfileInventory = () => {
  const {isAuthenticated} = useMoralis();
  const router = useRouter();

  React.useEffect(() => {
    console.log(isAuthenticated, "auth");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return (
    <ProfileLayoutComponent>
      <Inventory></Inventory>
    </ProfileLayoutComponent>
  );
};

export default ProfileInventory;
