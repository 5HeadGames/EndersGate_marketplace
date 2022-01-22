import {Typography} from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import {Icons} from "@shared/const/Icons";
import React from "react";
import "shared/firebase";
import {useAppSelector} from "redux/store";
import {useRouter} from "next/router";
import { Activity } from "@shared/components/Profile/index";
import clsx from "clsx";
import Activities from "@shared/components/Profile/activities/activities";

const ProfileActivities = () => {
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
      <Activities></Activities>
    </ProfileLayoutComponent>
  );
};

export default ProfileActivities;
