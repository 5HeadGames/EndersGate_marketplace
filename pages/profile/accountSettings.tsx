import { Typography } from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import { Icons } from "@shared/const/Icons";
import React from "react";
import "shared/firebase";
import { useAppSelector } from "redux/store";
import { useRouter } from "next/router";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";

const ProfileSettings = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  React.useEffect(() => {
    if (user && !user.address) {
      router.push("/login");
    }
    console.log(user);
  }, [user]);
  return (
    <ProfileLayoutComponent>
      <AccountSettingsComponent />
    </ProfileLayoutComponent>
  );
};

export default ProfileSettings;
