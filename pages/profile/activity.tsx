import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import Activities from "@shared/components/Profile/activities/activities";

const ProfileActivities = () => {
  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return <Activities></Activities>;
};

export default ProfileActivities;
