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
}

const NFTCard: React.FunctionComponent<Props> = (props) => {
  const { classes, ...rest } = props;

  return (
    <Link href="/NFTDetail">
      <div
        className={clsx(
          "rounded-xl p-4 flex flex-col text-white w-56 bg-secondary",
          classes?.root
        )}
      >
        <div className="w-full flex flex-col text-xs mb-4 gap-1">
          <div className="bg-primary p-2 rounded-md w-2/3 ">
            <span>#234243982743</span>
          </div>
          <div>
            <span>Axie #1235</span>
          </div>
          <div>
            <span>Breed count:4</span>
          </div>
        </div>
        <div className="w-full h-30 flex justify-center my-4">
          <img src={Icons.logo} className="w-24 h-24" />
        </div>
        <div className="flex flex-col text-sm text-center">
          <span>0.0017</span>
          <span>$253.77</span>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;
