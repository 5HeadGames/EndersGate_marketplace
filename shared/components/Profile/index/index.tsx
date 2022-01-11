import { Typography } from "@shared/components/common/typography";
import React from "react";
import { useAppSelector } from "redux/store";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";

const ProfileIndexPage = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  React.useEffect(() => {
    // if (user && !user.address) {
    //   router.push("/login");
    // }
    console.log(user);
  }, [user]);
  return (
    <>
      <div
        className={clsx(
          "flex flex-col border border-overlay-border p-4 rounded-md h-40 relative overflow-hidden mb-10"
        )}
      >
        <img
          src={Icons.harmony}
          className="absolute top-[-80px] right-[-80px]"
          alt=""
        />
        <div className="flex flex-row">
          <div className="flex flex-col">
            <h1 className="text-white" style={{ fontSize: "32px" }}>
              0 ONE
            </h1>
            <Typography type="title" className="text-primary ">
              0 USD
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <Typography type="title" className="text-white">
            Activities
          </Typography>
        </div>
        <hr className="w-full mt-4" />
      </div>
    </>
  );
};

export default ProfileIndexPage;
