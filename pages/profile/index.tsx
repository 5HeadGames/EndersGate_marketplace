import React from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import ProfileIndexPage from "@shared/components/Profile/index";

const Profile: React.FunctionComponent<{}> = () => {
  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <ProfileIndexPage />;
};

export default Profile;
