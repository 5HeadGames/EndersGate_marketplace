import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { CollapseMenu } from "@shared/components/common/collapseMenu/collapseMenu";
import { SlideButton } from "@shared/components/common/slideButton/slideButton";

const FiltersBoard = ({ filter, setFilter, type, setType, setPage }) => {
  const handleChange = (title) => {
    console.log(title);
    setPage(0);
    setFilter((prev) => {
      return { ...prev, [`${title}`]: !prev[`${title}`] };
    });
  };

  const filterItems = [
    {
      title: "Card Type",
      subItems: [
        {
          title: "Avatar",
          onClick: () => handleChange("avatar"),
          value: "avatar",
        },
        {
          title: "Guardian",
          onClick: () => handleChange("guardian"),
          value: "guardian",
        },
        {
          title: "Action Cards",
          onClick: () => handleChange("action_cards"),
          value: "action_cards",
        },
        {
          title: "Reaction Cards",
          onClick: () => handleChange("reaction_cards"),
          value: "reaction_cards",
        },
      ],
    },
    // {
    //   title: "Class",
    //   subItems: [
    //     {
    //       title: "Tanks",
    //       onClick: () => handleChange("tanks"),
    //       value: "tanks",
    //     },
    //     {
    //       title: "Damage",
    //       onClick: () => handleChange("damage"),
    //       value: "damage",
    //     },
    //     {
    //       title: "Mages",
    //       onClick: () => handleChange("mages"),
    //       value: "mages",
    //     },
    //     {
    //       title: "Healers",
    //       onClick: () => handleChange("healers"),
    //       value: "healers",
    //     },
    //   ],
    // },
    // {
    //   title: "Elements",
    //   subItems: [
    //     {
    //       title: "Void",
    //       onClick: () => handleChange("void"),
    //       value: "void",
    //     },
    //     {
    //       title: "Fire",
    //       onClick: () => handleChange("fire"),
    //       value: "fire",
    //     },
    //     {
    //       title: "Water",
    //       onClick: () => handleChange("water"),
    //       value: "water",
    //     },
    //     {
    //       title: "Mystic",
    //       onClick: () => handleChange("mystic"),
    //       value: "mystic",
    //     },
    //     {
    //       title: "Earth",
    //       onClick: () => handleChange("earth"),
    //       value: "earth",
    //     },
    //     {
    //       title: "Venom",
    //       onClick: () => handleChange("venom"),
    //       value: "venom",
    //     },
    //   ],
    // },
    {
      title: "Rarity",
      subItems: [
        {
          title: "Wood",
          onClick: () => handleChange("wood"),
          value: "wood",
        },
        {
          title: "Stone",
          onClick: () => handleChange("stone"),
          value: "stone",
        },
        {
          title: "Iron",
          onClick: () => handleChange("iron"),
          value: "iron",
        },
        {
          title: "Epic",
          onClick: () => handleChange("epic"),
          value: "epic",
        },
        {
          title: "Legendary",
          onClick: () => handleChange("legendary"),
          value: "legendary",
        },
        {
          title: "Common",
          onClick: () => handleChange("common"),
          value: "common",
        },
        {
          title: "Uncommon",
          onClick: () => handleChange("uncommon"),
          value: "uncommon",
        },
        {
          title: "Rare",
          onClick: () => handleChange("rare"),
          value: "rare",
        },
        {
          title: "Ultra Rare",
          onClick: () => handleChange("ultra_rare"),
          value: "ultra_rare",
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
    setFilter({
      packs: false,
      comics: false,
      avatar: false,
      champions: false,
      action_cards: false,
      reaction_cards: false,
      tanks: false,
      damage: false,
      mages: false,
      healers: false,
      void: false,
      fire: false,
      water: false,
      mystic: false,
      earth: false,
      venom: false,
      wood: false,
      stone: false,
      iron: false,
      epic: false,
      legendary: false,
      common: false,
      rare: false,
      ultra_rare: false,
      uncommon: false,
      limited_edition: false,
      attack: false,
      damage_stats: false,
      mages_stats: false,
    });
  };

  React.useEffect(() => {
    console.log(filter);
  }, [filter]);

  return (
    <div className="xl:w-80 w-full flex flex-col shrink-0">
      <div className="flex rounded-md bg-overlay-2 border border-overlay-border xl:pt-1 xl:px-6 p-4 xl:pb-16 w-full">
        <div className="flex xl:items-center gap-2 xl:flex-col gap-x-4 flex-row flex-wrap w-full">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-lg font-bold text-white">NFT Type</h2>
            {["trading_cards", "packs"].map((nftType, index) => (
              <div
                onClick={() => setType(nftType)}
                className={clsx(
                  "flex items-center justify-between  w-full  cursor-pointer",
                  "rounded-md",
                  "text-white text-lg",
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
                  {nftType === "trading_cards"
                    ? "Trading cards"
                    : nftType === "packs"
                    ? "Packs"
                    : "Comics"}
                </p>
                <div
                  className={clsx(
                    { ["bg-primary"]: type === nftType },
                    { ["bg-gray-400"]: type !== nftType },
                    "rounded-full w-6 h-6 border border-gray-800",
                  )}
                ></div>
              </div>
            ))}
          </div>
          {filterItems.map(
            ({ title, subItems /*, slideButton, value, onClick */ }, index) => (
              <div className="flex flex-col items-center gap-2 w-full">
                <h2 className="text-lg font-bold text-white xl:mt-3 w-full">
                  {title}
                </h2>

                {subItems.map(
                  (subItem, indexItem) => {
                    return (
                      <div
                        onClick={subItem.onClick}
                        className={clsx(
                          "flex items-center justify-between w-full  cursor-pointer",
                          "rounded-md",
                          "text-white text-lg",
                        )}
                      >
                        <p
                          className={clsx(
                            {
                              ["text-gray-300"]: !filter[`${subItem.value}`],
                            },
                            {
                              ["text-white"]: filter[`${subItem.value}`],
                            },
                          )}
                        >
                          {subItem.title}
                        </p>
                        <div
                          className={clsx(
                            { ["bg-primary"]: filter[`${subItem.value}`] },
                            { ["bg-gray-400"]: !filter[`${subItem.value}`] },
                            "rounded-full w-6 h-6 border border-gray-800",
                          )}
                        ></div>
                      </div>
                    );
                  },
                  // })
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersBoard;
