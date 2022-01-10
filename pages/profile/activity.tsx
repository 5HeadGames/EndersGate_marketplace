import {Typography} from "@shared/components/common/typography";
import ProfileLayoutComponent from "@shared/components/Profile/profile";
import {Icons} from "@shared/const/Icons";
import React from "react";
import "shared/firebase";
import {useAppSelector} from "redux/store";
import {useRouter} from "next/router";

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
      <div className='flex flex-col h-full'>
        <h2 className="text-purple-300/75" style={{fontSize: "1.5rem"}}>
          Activity
        </h2>
        <div className="w-full h-full justify-center items-center flex flex-col">
          <img className="h-24 w-24 " src={Icons.logo} alt="logo" />
          <Typography type='title' className='text-purple-300/50'>No new activity yet</Typography>
        </div>
      </div>
    </ProfileLayoutComponent>
  );
};

export default ProfileSettings;
