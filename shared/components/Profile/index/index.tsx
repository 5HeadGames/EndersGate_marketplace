import { Typography } from "@shared/components/common/typography";
import React from "react";
import { useAppSelector } from "redux/store";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import { CopyOutlined, SelectOutlined } from "@ant-design/icons";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { useToasts } from "react-toast-notifications";

const ProfileIndexPage = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  React.useEffect(() => {
    // if (user && !user.address) {
    //   router.push("/login");
    // }
    console.log(user);
  }, [user]);

  const { addToast } = useToasts();

  return (
    <>
      <div
        className={clsx(
          "flex flex-col justify-between border border-overlay-border p-4 rounded-t-md h-52 relative overflow-hidden"
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
      <div className="flex justify-between border border-t-0 border-overlay-border p-4 rounded-b-md">
        <Typography type="subTitle" className="text-primary">
          Harmony Address: <AddressText text={user.address} />
        </Typography>
        <div className="flex items-center text-primary gap-4">
          <div
            onClick={() => {
              navigator.clipboard.writeText(user.address);
              addToast("Copied to clipboard", { appearance: "info" });
            }}
            className="cursor-pointer"
          >
            <CopyOutlined />
          </div>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://explorer.harmony.one/address/${user.address}`}
          >
            <SelectOutlined />
          </a>
        </div>
      </div>
      <div className="flex flex-col w-full mt-10">
        <div className="flex justify-between w-full items-center">
          <Typography type="title" className="text-white">
            Activities
          </Typography>
          <Typography type="span" className="text-primary cursor-pointer">
            View More
          </Typography>
        </div>
        <hr className="w-full mt-4" />
      </div>
    </>
  );
};

export default ProfileIndexPage;
