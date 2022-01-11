import { Typography } from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import { Icons } from "@shared/const/Icons";
import React from "react";
import "shared/firebase";
import { useAppSelector } from "redux/store";
import { useRouter } from "next/router";
import Inventory from "@shared/components/Profile/inventory/inventory";

const ProfileInventory = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  React.useEffect(() => {
    // if (user && !user.address) {
    //   router.push("/login");
    // }
    console.log(user);
  }, [user]);
  return (
    <ProfileLayoutComponent>
      <Inventory></Inventory>
    </ProfileLayoutComponent>
  );
};

export default ProfileInventory;
