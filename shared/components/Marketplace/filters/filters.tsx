import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import {
  HeartOutlined,
  HeartFilled,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { CollapseMenu } from "@shared/components/common/collapseMenu/collapseMenu";
import { SlideButton } from "@shared/components/common/slideButton/slideButton";
import { InputNumber } from "antd";
import { Input } from "@shared/components/common/form/input";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

const FiltersBoard = ({
  filters,
  setFilters,
  setCardType,
  cardType,
  type,
  setType,
  setPage,
  setPriceSettings,
}) => {
  const handleAvatarChange = (checked, value) => {
    if (checked) {
      setFilters({ ...filters, avatar: [...filters.avatar, value] });
    } else {
      let arr = [...filters.avatar];
      const index = arr.findIndex((item) => item === value);
      arr.splice(index, 1);
      setFilters({ ...filters, avatar: arr });
    }
  };

  const handleRaceChange = (checked, value) => {
    if (checked) {
      setFilters({ ...filters, cardRace: [...filters.cardRace, value] });
    } else {
      let arr = [...filters.cardRace];
      const index = arr.findIndex((item) => item === value);
      arr.splice(index, 1);
      setFilters({ ...filters, cardRace: arr });
    }
  };

  const handleRoleChange = (checked, value) => {
    if (checked) {
      setFilters({ ...filters, cardRole: [...filters.cardRole, value] });
    } else {
      let arr = [...filters.cardRole];
      const index = arr.findIndex((item) => item === value);
      arr.splice(index, 1);
      setFilters({ ...filters, cardRole: arr });
    }
  };

  const handleElementChange = (checked, value) => {
    if (checked) {
      setFilters({ ...filters, cardElement: [...filters.cardElement, value] });
    } else {
      let arr = [...filters.cardElement];
      const index = arr.findIndex((item) => item === value);
      arr.splice(index, 1);
      setFilters({ ...filters, cardElement: arr });
    }
  };

  const filterItems = [
    {
      title: "Guardian Card Class",
      subItems: [
        {
          title: "Fighter",
          onClick: () =>
            handleRoleChange(!filters.cardRole.includes("fighter"), "fighter"),
          value: "fighter",
          valueBool: filters.cardRole.includes("fighter"),
        },
        {
          title: "Mage",
          onClick: () =>
            handleRoleChange(!filters.cardRole.includes("mage"), "mage"),
          value: "mage",
          valueBool: filters.cardRole.includes("mage"),
        },
        {
          title: "Assassin",
          onClick: () =>
            handleRoleChange(
              !filters.cardRole.includes("assassin"),
              "assassin",
            ),
          value: "assassin",
          valueBool: filters.cardRole.includes("assassin"),
        },
        {
          title: "Tank",
          onClick: () =>
            handleRoleChange(!filters.cardRole.includes("tank"), "tank"),
          value: "tank",
          valueBool: filters.cardRole.includes("tank"),
        },
        {
          title: "Support",
          onClick: () =>
            handleRoleChange(!filters.cardRole.includes("support"), "support"),
          value: "support",
          valueBool: filters.cardRole.includes("support"),
        },
        {
          title: "Healer",
          onClick: () =>
            handleRoleChange(!filters.cardRole.includes("healer"), "healer"),
          value: "healer",
          valueBool: filters.cardRole.includes("healer"),
        },
      ],
    },
    {
      title: "Guardian Card Race",
      subItems: [
        {
          title: "Human",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("human"), "human"),
          value: "human",
          valueBool: filters.cardRace.includes("human"),
        },
        {
          title: "Dwarf",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("dwarf"), "dwarf"),
          value: "dwarf",
          valueBool: filters.cardRace.includes("dwarf"),
        },
        {
          title: "Beast",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("beast"), "beast"),
          value: "beast",
          valueBool: filters.cardRace.includes("beast"),
        },
        {
          title: "Goblin",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("goblin"), "goblin"),
          value: "goblin",
          valueBool: filters.cardRace.includes("goblin"),
        },
        {
          title: "Ogre",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("ogre"), "ogre"),
          value: "ogre",
          valueBool: filters.cardRace.includes("ogre"),
        },
        {
          title: "Zombie",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("zombie"), "zombie"),
          value: "zombie",
          valueBool: filters.cardRace.includes("zombie"),
        },
        {
          title: "Vampire",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("vampire"), "vampire"),
          value: "vampire",
          valueBool: filters.cardRace.includes("vampire"),
        },
        {
          title: "Demon",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("demon"), "demon"),
          value: "demon",
          valueBool: filters.cardRace.includes("demon"),
        },

        {
          title: "Undead",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("undead"), "undead"),
          value: "undead",
          valueBool: filters.cardRace.includes("undead"),
        },
        {
          title: "Insect",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("insect"), "insect"),
          value: "insect",
          valueBool: filters.cardRace.includes("insect"),
        },
        {
          title: "Elemental",
          onClick: () =>
            handleRaceChange(
              !filters.cardRace.includes("elemental"),
              "elemental",
            ),
          value: "elemental",
          valueBool: filters.cardRace.includes("elemental"),
        },
        {
          title: "Golem",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("golem"), "golem"),
          value: "golem",
          valueBool: filters.cardRace.includes("golem"),
        },
        {
          title: "Cephalo",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("cephalo"), "cephalo"),
          value: "cephalo",
          valueBool: filters.cardRace.includes("cephalo"),
        },
        {
          title: "Spirit",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("spirit"), "spirit"),
          value: "spirit",
          valueBool: filters.cardRace.includes("spirit"),
        },
        {
          title: "Monster",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("monster"), "monster"),
          value: "monster",
          valueBool: filters.cardRace.includes("monster"),
        },
        {
          title: "Monster",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("monster"), "monster"),
          value: "monster",
          valueBool: filters.cardRace.includes("monster"),
        },
        {
          title: "Ascended",
          onClick: () =>
            handleRaceChange(
              !filters.cardRace.includes("ascended"),
              "ascended",
            ),
          value: "ascended",
          valueBool: filters.cardRace.includes("ascended"),
        },
        {
          title: "Giant",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("giant"), "giant"),
          value: "giant",
          valueBool: filters.cardRace.includes("giant"),
        },
        {
          title: "Sentinel",
          onClick: () =>
            handleRaceChange(
              !filters.cardRace.includes("sentinel"),
              "sentinel",
            ),
          value: "sentinel",
          valueBool: filters.cardRace.includes("sentinel"),
        },
        {
          title: "Shark",
          onClick: () =>
            handleRaceChange(!filters.cardRace.includes("shark"), "shark"),
          value: "shark",
          valueBool: filters.cardRace.includes("shark"),
        },
      ],
    },
    {
      title: "Guardian Card Element",
      subItems: [
        {
          title: "Void",
          onClick: () =>
            handleElementChange(!filters.cardElement.includes("void"), "void"),
          value: "void",
          valueBool: filters.cardElement.includes("void"),
        },
        {
          title: "Fire",
          onClick: () =>
            handleElementChange(!filters.cardElement.includes("fire"), "fire"),
          value: "fire",
          valueBool: filters.cardElement.includes("fire"),
        },
        {
          title: "Water",
          onClick: () =>
            handleElementChange(
              !filters.cardElement.includes("water"),
              "water",
            ),
          value: "water",
          valueBool: filters.cardElement.includes("water"),
        },
        {
          title: "Mystic",
          onClick: () =>
            handleElementChange(
              !filters.cardElement.includes("mystic"),
              "mystic",
            ),
          value: "mystic",
          valueBool: filters.cardElement.includes("mystic"),
        },
        {
          title: "Earth",
          onClick: () =>
            handleElementChange(
              !filters.cardElement.includes("earth"),
              "earth",
            ),
          value: "earth",
          valueBool: filters.cardElement.includes("earth"),
        },
        {
          title: "Venom",
          onClick: () =>
            handleElementChange(
              !filters.cardElement.includes("venom"),
              "venom",
            ),
          value: "venom",
          valueBool: filters.cardElement.includes("venom"),
        },
      ],
    },
    // {
    //   title: "Limited Edition",
    //   onClick: () => handleChange("limited_edition"),
    //   slideButton: true,
    //   value: "limited_edition",
    // },
    // {
    //   title: "Stats",
    //   subItems: [
    //     {
    //       title: "Attack",
    //       onClick: () => handleChange("attack"),
    //       value: "attack",
    //     },
    //     {
    //       title: "Damage",
    //       onClick: () => handleChange("damage_stats"),
    //       value: "damage_stats",
    //     },
    //     {
    //       title: "Mages",
    //       onClick: () => handleChange("mages_stats"),
    //       value: "mages_stats",
    //     },
    //   ],
    // },
  ];

  const Reset = () => {
    setFilters();
  };

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  const [priceCollapsed, setPriceCollapsed] = React.useState(true);

  return (
    <div className="xl:w-52 w-full flex flex-col shrink-0">
      <div className="flex rounded-md bg-overlay-2 border border-overlay-border xl:pt-1 xl:px-6 p-4 xl:pb-16 w-full">
        <div className="flex xl:items-center gap-2 xl:flex-col gap-x-16 flex-row flex-wrap justify-center w-full">
          <div className="flex flex-col gap-2 lg:w-full w-48">
            <h2
              className="text-lg font-bold text-red-primary lg:text-left text-center cursor-pointer flex w-full items-center gap-2"
              onClick={() => setPriceCollapsed((prev) => !prev)}
            >
              Price in USD{" "}
              {priceCollapsed ? (
                <ChevronDownIcon className="w-7" />
              ) : (
                <ChevronUpIcon className="w-7" />
              )}
            </h2>
            <div
              className={clsx(
                { ["hidden"]: !priceCollapsed },
                "flex gap-4 justify-between",
              )}
            >
              <div className="flex flex-col w-1/2">
                <p className="text-white text-[16px] font-bold">Lowest</p>
                <div className="rounded-xl flex items-center border border-overlay-border w-full px-1">
                  <input
                    type={"number"}
                    name="min"
                    className="bg-transparent w-full text-white pl-2 text-[13px] py-1"
                    defaultValue={0}
                    onChange={(e) => {
                      setPriceSettings((prev) => {
                        return { ...prev, minPrice: e.target.value };
                      });
                    }}
                  />
                  <p className="w-6 text-[10px] text-overlay-border">USD</p>
                </div>
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-white text-[16px] font-bold">Highest</p>
                <div className="rounded-xl flex items-center border border-overlay-border w-full px-1 ">
                  <input
                    type={"number"}
                    name="max"
                    className="bg-transparent w-full text-white pl-2 text-[13px] py-1"
                    defaultValue={0}
                    onChange={(e) => {
                      setPriceSettings((prev) => {
                        return { ...prev, maxPrice: e.target.value };
                      });
                    }}
                  />
                  <p className="w-6 text-[10px] text-overlay-border">USD</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:w-full w-48">
            <h2 className="text-lg font-bold text-white lg:text-left text-center">
              NFT Type
            </h2>
            <div className="flex flex-col gap-1 w-full">
              {[
                { text: "Reaction Card", value: "reaction" },
                { text: "Action Cards", value: "action" },
                { text: "Avatar Cards", value: "avatar" },
              ].map((item, index) => (
                <div
                  onClick={() => {
                    if (item.value !== cardType) {
                      setType("trading_cards");
                      setCardType(item.value);
                    } else {
                      setCardType("all");
                      setType("");
                    }
                  }}
                  className={clsx(
                    "flex items-center justify-between  w-full  cursor-pointer",
                    "rounded-md",
                    "text-white text-[15px]",
                  )}
                >
                  <p
                    className={clsx(
                      {
                        ["text-gray-300"]: item.value !== cardType,
                      },
                      {
                        ["text-white"]: cardType === item.value,
                      },
                    )}
                  >
                    {item.text}
                  </p>
                  <div
                    className={clsx(
                      { ["bg-primary"]: cardType === item.value },
                      { ["bg-gray-800"]: cardType !== item.value },
                      "rounded-full w-6 h-6 border border-gray-800",
                    )}
                  ></div>
                </div>
              ))}
              {["packs"].map((nftType, index) => (
                <div
                  onClick={() => {
                    if (nftType !== type) {
                      setCardType("all");
                      setType(nftType);
                    } else {
                      setCardType("all");
                      setType("");
                    }
                  }}
                  className={clsx(
                    "flex items-center justify-between  w-full  cursor-pointer",
                    "rounded-md",
                    "text-white text-[15px]",
                  )}
                >
                  <p
                    className={clsx(
                      {
                        ["text-gray-300"]: nftType !== type,
                      },
                      {
                        ["text-white"]: type === nftType,
                      },
                    )}
                  >
                    {nftType === "packs" ? "Packs" : "Comics"}
                  </p>
                  <div
                    className={clsx(
                      { ["bg-primary"]: type === nftType },
                      { ["bg-gray-800"]: type !== nftType },
                      "rounded-full w-6 h-6 border border-gray-800",
                    )}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:w-full w-48">
            <h2 className="text-lg font-bold text-white lg:text-left text-center w-full">
              EG Guardian Card Rarity
            </h2>
            <div className="flex flex-col gap-1 w-full">
              {[
                { text: "Common (wood)", value: "wood" },
                { text: "Uncommon (stone)", value: "stone" },
                { text: "Rare (silver)", value: "iron" },
                { text: "Epic (gold)", value: "gold" },
                { text: "Legendary", value: "legendary" },
              ].map((item, index) => (
                <div
                  onClick={() => setCardType(item.value)}
                  className={clsx(
                    "flex items-center justify-between  w-full  cursor-pointer",
                    "rounded-md",
                    "text-white text-[15px]",
                  )}
                >
                  <p
                    className={clsx(
                      {
                        ["text-gray-300"]: item.value !== cardType,
                      },
                      {
                        ["text-white"]: cardType === item.value,
                      },
                    )}
                  >
                    {item.text}
                  </p>
                  <div
                    className={clsx(
                      { ["bg-primary"]: cardType === item.value },
                      { ["bg-gray-800"]: cardType !== item.value },
                      "rounded-full w-6 h-6 border border-gray-800",
                    )}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          {filterItems.map(
            ({ title, subItems /*, slideButton, value, onClick */ }, index) => (
              <div className="flex flex-col items-center gap-2 lg:w-full w-48">
                <h2 className="text-lg font-bold text-white lg:text-left text-center w-full">
                  {title}
                </h2>
                <div className="flex flex-col gap-1 w-full">
                  {subItems.map(
                    (subItem, indexItem) => {
                      return (
                        <div
                          onClick={subItem.onClick}
                          className={clsx(
                            "flex items-center justify-between w-full  cursor-pointer",
                            "rounded-md",
                            "text-white text-[15px]",
                          )}
                        >
                          <p
                            className={clsx(
                              {
                                ["text-gray-300"]: !subItem.valueBool,
                              },
                              {
                                ["text-white"]: subItem.valueBool,
                              },
                            )}
                          >
                            {subItem.title}
                          </p>
                          <div
                            className={clsx(
                              { ["bg-primary"]: subItem.valueBool },
                              { ["bg-gray-800"]: !subItem.valueBool },
                              "rounded-full w-6 h-6 border border-gray-800",
                            )}
                          ></div>
                        </div>
                      );
                    },
                    // })
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersBoard;
