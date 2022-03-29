import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import Link from "next/link";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  classes?: Partial<Record<"root", string>>;
  icon?: string;
  id?: any;
  name?: any;
  balance?: any;
}

const NFTCard: React.FunctionComponent<Props> = (props) => {
  const { classes, ...rest } = props;

  return (
    <Link href={`/NFTDetail/${props.id}`}>
      <div
        className={clsx(
          "rounded-xl p-4 flex flex-col text-white w-56 bg-secondary cursor-pointer",
          classes?.root
        )}
      >
        <div className="w-full flex flex-col text-xs gap-1">
          <div className="w-full flex justify-between">
            <span>Card #{props.id !== undefined ? props.id : "12345"}</span>
            <span>x{props.balance}</span>
          </div>
          {/* <div>
            <span>Breed count:4</span>
          </div> */}
        </div>
        <div className="w-full h-36 flex justify-center items-center my-4">
          <img
            src={props.icon || Icons.logo}
            className={props.icon ? "h-36" : "h-24"}
          />
        </div>
        <div className="flex flex-col text-sm text-center">
          <span>{props.name || "Enders Gate"}</span>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;
