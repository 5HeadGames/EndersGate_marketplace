import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";

import { useRouter } from "next/router";
import Sales from "@shared/components/Profile/sales/sales";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";

const ProfileInventory = () => {
  const { user } = useMagicLink();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !user.ethAddress) {
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
