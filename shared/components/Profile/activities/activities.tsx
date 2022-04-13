import {Typography} from "@shared/components/common/typography";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import {useAppSelector} from "redux/store";
import Styles from "./styles.module.scss";
import {Activity} from "../index/index";

const navItems = [
  {title: "Trading Cards", value: "trading_cards"},
  {title: "Packs", value: "packs"},
  {title: "Comics", value: "comics"},
];

const Activities = () => {
  const user = useAppSelector((state) => state.user);
  const [columnSelected, setColumnSelected] = React.useState("trading_cards");
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <Typography type="title" className="text-white">
          Activities
        </Typography>
      </div>
      <hr className="w-full my-4" />
      <div
        className={clsx(
          "w-full ",
          "flex flex-col",
          {
            [`${Styles.gray} justify-center items-center gap-6 h-72`]: !user.activity,
          },
          {
            ["gap-y-2"]: user.activity,
          }
        )}
      >
        {user.activity ? (
          user.activity.map(({createdAt, type}, index) => {
            return <Activity date={createdAt} type={type} />;
          })
        ) : (
          <>
            <img src={Icons.logo} className="h-40 w-40" alt="" />
            <Typography type="subTitle" className={clsx(Styles.title, "text-primary")}>
              You don't have any activity yet
            </Typography>
          </>
        )}
      </div>
    </>
  );
};

export default Activities;
