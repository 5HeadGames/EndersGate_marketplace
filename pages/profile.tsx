import { Typography } from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import { Icons } from "@shared/const/Icons";
import React from "react";
import "shared/firebase";
import { useAppSelector } from "redux/store";
import { useRouter } from "next/router";

const Profile = () => {
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
      <div className="flex flex-col border border-overlay-border p-4 items-center">
        <img src={Icons.harmony} className="w-16" alt="" />
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <h1 className="text-white text-center" style={{ fontSize: "32px" }}>
              0 ONE
            </h1>
            <Typography type="title" className="text-primary text-center">
              0 USD
            </Typography>
          </div>
        </div>
      </div>
    </ProfileLayoutComponent>
  );
};

export default Profile;
