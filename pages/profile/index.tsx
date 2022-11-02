import React from "react";

import { useRouter } from "next/router";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import ProfileIndexPage from "@shared/components/Profile/index";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";

const Profile: React.FunctionComponent<{}> = () => {
  const { user } = useMagicLink();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !user.ethAddress) {
      console.log(user, user.ethAddress, "xd");
      router.push("/login");
    }
  }, [user]);

  return (
    <ProfileLayoutComponent>
      <ProfileIndexPage />
    </ProfileLayoutComponent>
  );
};

export default Profile;
