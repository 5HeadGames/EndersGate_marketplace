import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Sales from "@shared/components/Profile/sales/sales";

const ProfileInventory = () => {
  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return (
    <ProfileLayoutComponent>
      <Sales></Sales>
    </ProfileLayoutComponent>
  );
};

export default ProfileInventory;