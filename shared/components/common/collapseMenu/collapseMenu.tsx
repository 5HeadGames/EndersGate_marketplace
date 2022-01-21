import * as React from "react";
import clsx from "clsx";
import {Typography} from "../typography";
import {Icons} from "@shared/const/Icons";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

interface Props {
  title: string;
  defaultOpen?: boolean;
  classes?: Partial<Record<"root" | "container", string>>;
}

export const CollapseMenu: React.FunctionComponent<Props> = ({
  children,
  title,
  defaultOpen = false,
  classes,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={clsx("text-right", classes?.root)}>
      <div
        className={clsx(
          "relative inline-block text-left w-full",
          classes?.container
        )}
      >
        <div className="w-full">
          <div className="inline-flex w-full text-sm font-medium bg-transparent focus:outline-none">
            <div
              className={clsx(
                "border-none flex items-center cursor-pointer text-primary"
              )}
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <CaretUpOutlined /> : <CaretDownOutlined />}
              <Typography className="ml-2" type="subTitle">
                {title}
              </Typography>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            { ["hidden"]: !open },
            "flex top-0 right-0 origin-top-right mt-2 bg-white divide-y rounded-b-10 focus:outline-none"
          )}
        >
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
