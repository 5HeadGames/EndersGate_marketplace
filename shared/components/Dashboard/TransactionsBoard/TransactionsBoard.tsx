import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import {
  LineChartOutlined,
  MobileOutlined,
  PieChartFilled,
} from "@ant-design/icons";
import Web3 from "web3";
import { getAddressesMatic, getContractWebSocket } from "@shared/web3";
import contracts from "@shared/contracts";
import { Dropdown } from "@shared/components/common/dropdown/dropdown";
import { nFormatter } from "@shared/components/common/specialFields/SpecialFields";

const navItems = [
  { title: "7 days", value: "last_7d" },
  { title: "30 days", value: "last_30d" },
  { title: "90 days", value: "last_90d" },
  { title: "All Time", value: "forever" },
];

const TransactionsBoard: React.FC<any> = ({
  totalSale,
  totalVolume,
  cardsSold,
  packsSold,
  columnSelected,
  setColumnSelected,
}) => {
  const platformItems = [
    {
      title: "Items",
      value: nFormatter(totalSale),
      iconHtml: <PieChartFilled />,
      css: {
        /* Chrome 10-25, Safari 5.1-6 */
        background:
          "linear-gradient(to right, #00bf8f, #004515)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      },
    },
    {
      title: "Volume",
      value: nFormatter(totalVolume).toString() + " USD",
      // value2: "$1,57M",
      iconHtml: <LineChartOutlined />,
      css: {
        /* Chrome 10-25, Safari 5.1-6 */
        background:
          "linear-gradient(to right, #2c3e50, #3498db)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      },
    },
    {
      title: "Cards Sold",
      value: nFormatter(cardsSold),
      icon: Icons.cards,
      css: {
        /* Chrome 10-25, Safari 5.1-6 */
        background:
          "linear-gradient(to right, #6441a5, #2b1045)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      },
    },
    {
      title: "Packs Sold",
      value: nFormatter(packsSold),
      icon: Icons.packs,
      css: {
        /* Chrome 10-25, Safari 5.1-6 */
        background:
          "linear-gradient(to right, #cb7a00, #dfda1b)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      },
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="xl:max-w-[900px] w-full rounded-xl border border-overlay-border relative">
        <p className="absolute sm:top-4 top-2 sm:right-6 right-2 text-overlay-border sm:text-sm text-[10px]">
          STATS PANEL
        </p>
        {/* <div className="flex border-b-2 border-overlay-border">
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
                      "bg-primary text-overlay": columnSelected === item.value,
                    },
                    {
                      "text-primary": columnSelected !== item.value,
                    },
                    "px-6 py-2",
                  )}
                >
                  {item.title}
                </Typography>
              </div>
            );
          })}
        </div> */}
        <div className="flex sm:flex-row flex-col py-4 px-6 sm:gap-x-16 gap-x-2 md:justify-start items-center justify-center">
          <Dropdown
            classTitle={"text-red-primary hover:text-orange-500 text-3xl"}
            title={"Stats"}
          >
            <div className="flex flex-col rounded-md border border-overlay-border">
              {["Price in USDC", "Price in ONE", "Price in MATIC"].map(
                (item) => (
                  <div
                    className="p-4 text-center font-bold hover:text-orange-500 text-primary whitespace-nowrap cursor-pointer"
                    onClick={() => console.log(item)}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </Dropdown>
          <div className="flex flex-wrap sm:gap-x-16 gap-x-8 sm:justify-start justify-center w-full">
            {platformItems.map((item, index) => {
              return (
                <PlatformMovements
                  icon={item?.icon}
                  iconHtml={item.iconHtml}
                  css={item.css}
                  label={item.title}
                  value={item.value}
                  value2={""}
                  key={"platform-" + index}
                />
              );
            })}
          </div>
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
    <div className="xl:pl-4 xl:block flex flex-col items-center justify-center xl:mt-0 mt-4">
      <p className="text-sm text-center" style={{ color: "#47E439" }}>
        {label}
      </p>
      <p className="text-white text-center font-bold text-xl">
        {value} {value2}
      </p>
    </div>
  );
};

export default TransactionsBoard;
