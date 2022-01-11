import {Typography} from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import {Icons} from "@shared/const/Icons";
import React from "react";
import Table from "shared/components/Dashboard/tableItems/table";
import {useAppSelector} from "redux/store";
import {useRouter} from "next/router";
import clsx from "clsx";
import ProfileIndexPage from "@shared/components/Profile/index";

const Profile = () => {
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
      <ProfileIndexPage />
    </ProfileLayoutComponent>
  );
};

export default Profile;
