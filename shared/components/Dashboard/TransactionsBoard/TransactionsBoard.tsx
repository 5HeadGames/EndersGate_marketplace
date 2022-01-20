import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import { PieChartFilled } from "@ant-design/icons";
const navItems = [
  { title: "Last 24h", value: "last_24h" },
  { title: "7 days", value: "last_7d" },
  { title: "30 days", value: "last_30d" },
];

const platformItems = [
  {
    title: "TOTAL SALE",
    value: "48,580",
    iconHtml: <PieChartFilled />,
    css: {
      /* Chrome 10-25, Safari 5.1-6 */
      background:
        "linear-gradient(to right, #00bf8f, #004515)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
    },
  },
  {
    title: "TOTAL VOLUME",
    value: "1,541",
    value2: "$1,57M",
    icon: Icons.harmony,
    css: {
      /* Chrome 10-25, Safari 5.1-6 */
      background:
        "linear-gradient(to right, #2c3e50, #3498db)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
    },
  },
  {
    title: "CARD SOLD",
    value: "1,200",
    icon: Icons.logo,
    css: {
      /* Chrome 10-25, Safari 5.1-6 */
      background:
        "linear-gradient(to right, #6441a5, #2b1045)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
    },
  },
];

const TransactionsBoard = () => {
  const [columnSelected, setColumnSelected] = React.useState("last_24h");
  return (
    <div className="w-full flex flex-col">
      <div className="w-full rounded-md border-2 border-overlay-border">
        <div className="flex border-b-2 border-overlay-border">
          {navItems.map((item, index) => {
            return (
              <div
                key={"filterPlatform" + index}
                className="border-r-2 border-overlay-border cursor-pointer"
                onClick={() => setColumnSelected(item.value)}
              >
                <Typography
                  type="subTitle"
                  className={clsx(
                    {
                      "bg-primary-disabled text-white":
                        columnSelected === item.value,
                    },
                    {
                      "text-primary": columnSelected !== item.value,
                    },
                    "px-6 py-4"
                  )}
                >
                  {item.title}
                </Typography>
              </div>
            );
          })}
        </div>
        <div className="flex sm:flex-row flex-col py-10 px-8 sm:gap-x-16 gap-y-4 md:justify-start justify-center">
          {platformItems.map((item, index) => {
            return (
              <PlatformMovements
                icon={item?.icon}
                iconHtml={item.iconHtml}
                css={item.css}
                label={item.title}
                value={item.value}
                value2={item.value2 || ""}
                key={"platform-" + index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PlatformMovements = ({
  icon,
  css,
  label,
  value,
  value2,
  iconHtml,
}) => {
  return (
    <div className="flex xl:flex-row flex-col items-center">
      <div
        className="flex items-center justify-center p-4 rounded-full h-max w-max text-3xl text-white"
        style={css}
      >
        {iconHtml && iconHtml}
        {icon && <img src={icon} className="h-8 w-8" alt="" />}
      </div>
      <div className="xl:pl-4 xl:block flex flex-col items-center xl:mt-0 mt-4">
        <Typography className="text-primary text-center" type="label">
          {label}
        </Typography>
        <Typography type="subTitle" className="text-white text-center">
          {value} {value2}
        </Typography>
      </div>
    </div>
  );
};

export default TransactionsBoard;
