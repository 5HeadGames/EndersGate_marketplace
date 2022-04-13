import ProfileLayoutComponent from "@shared/components/Profile/profile";
import {useMoralis} from "react-moralis";
import React from "react";
import {useRouter} from "next/router";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";

const ProfileSettings = () => {
  const {isAuthenticated} = useMoralis();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return (
    <ProfileLayoutComponent>
      <AccountSettingsComponent />
    </ProfileLayoutComponent>
  );
};

export default ProfileSettings;
