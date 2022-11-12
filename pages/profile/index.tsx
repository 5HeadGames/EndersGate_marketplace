import React from "react";
import { useRouter } from "next/router";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import ProfileIndexPage from "@shared/components/Profile/index";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

const Profile: React.FunctionComponent<{}> = () => {
  const { account: user } = useWeb3React();
  const router = useRouter();

  React.useEffect(() => {
    console.log(user, "aaaaaaaaa");
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return <ProfileIndexPage />;
};

export default Profile;
