import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { CollapseMenu } from "@shared/components/common/collapseMenu/collapseMenu";
import { SlideButton } from "@shared/components/common/slideButton/slideButton";

const FiltersBoard = ({
  filters,
  setFilters,
  setCardType,
  cardType,
  type,
  setType,
  setPage,
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
    // {
    //   title: "Card Type",
    //   subItems: [
    //     {
    //       title: "Avatar",
    //       onClick: () =>
    //         handleAvatarChange(!filters.avatar.includes("avatar"), "avatar"),
    //       value: "avatar",
    //       valueBool: filters.avatar.includes("avatar"),
    //     },
    //     {
    //       title: "Guardian",
    //       onClick: () =>
    //         handleAvatarChange(
    //           !filters.avatar.includes("guardian"),
    //           "guardian",
    //         ),
    //       value: "guardian",
    //       valueBool: filters.avatar.includes("guardian"),
    //     },
    //     {
    //       title: "Action Cards",
    //       onClick: () =>
    //         handleAvatarChange(
    //           !filters.avatar.includes("action_cards"),
    //           "action_cards",
    //         ),
    //       value: "action_cards",
    //       valueBool: filters.avatar.includes("action_cards"),
    //     },
    //     {
    //       title: "Reaction Cards",
    //       onClick: () =>
    //         handleAvatarChange(
    //           !filters.avatar.includes("reaction_cards"),
    //           "reaction_cards",
    //         ),
    //       value: "reaction_cards",
    //       valueBool: filters.avatar.includes("reaction_cards"),
    //     },
    //   ],
    // },
    {
      title: "Role",
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
      title: "Race",
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
      title: "Elements",
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
                            { ["bg-gray-400"]: !subItem.valueBool },
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
          <h2 className="text-lg font-bold text-white w-full">Rarity</h2>

          {[
            { text: "Reaction Card", value: "reaction" },
            { text: "Action Card", value: "action" },
            { text: "Wood", value: "wood" },
            { text: "Stone", value: "stone" },
            { text: "Iron", value: "iron" },
            { text: "Gold", value: "gold" },
            { text: "Legendary", value: "legendary" },
            { text: "Avatar", value: "avatar" },
          ].map((item, index) => (
            <div
              onClick={() => setCardType(item.value)}
              className={clsx(
                "flex items-center justify-between  w-full  cursor-pointer",
                "rounded-md",
                "text-white text-lg",
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
                  { ["bg-gray-400"]: cardType !== item.value },
                  "rounded-full w-6 h-6 border border-gray-800",
                )}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersBoard;
