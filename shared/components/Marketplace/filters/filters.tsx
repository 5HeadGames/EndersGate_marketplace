import {Typography} from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import {HeartOutlined, HeartFilled} from '@ant-design/icons'
import {CollapseMenu} from "@shared/components/common/collapseMenu/collapseMenu";
import {SlideButton} from "@shared/components/common/slideButton/slideButton";

const FiltersBoard = ({filter, setFilter}) => {
  const handleChange = (title) => {
    setFilter((prev) => {
      return {...prev, [`${title}`]: !prev[`${title}`]};
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
          title: "Champions",
          onClick: () => handleChange("champions"),
          value: "champions",
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
    {
      title: "Class",
      subItems: [
        {
          title: "Tanks",
          onClick: () => handleChange("tanks"),
          value: "tanks",
        },
        {
          title: "Damage",
          onClick: () => handleChange("damage"),
          value: "damage",
        },
        {
          title: "Mages",
          onClick: () => handleChange("mages"),
          value: "mages",
        },
        {
          title: "Healers",
          onClick: () => handleChange("healers"),
          value: "healers",
        },
      ],
    },
    {
      title: "Elements",
      subItems: [
        {
          title: "Void",
          onClick: () => handleChange("void"),
          value: "void",
        },
        {
          title: "Fire",
          onClick: () => handleChange("fire"),
          value: "fire",
        },
        {
          title: "Water",
          onClick: () => handleChange("water"),
          value: "water",
        },
        {
          title: "Mystic",
          onClick: () => handleChange("mystic"),
          value: "mystic",
        },
        {
          title: "Earth",
          onClick: () => handleChange("earth"),
          value: "earth",
        },
        {
          title: "Venom",
          onClick: () => handleChange("venom"),
          value: "venom",
        },
      ],
    },
    {
      title: "Rairty",
      subItems: [
        {
          title: "1-Wood",
          onClick: () => handleChange("wood"),
          value: "wood",
        },
        {
          title: "2-Stone",
          onClick: () => handleChange("stone"),
          value: "stone",
        },
        {
          title: "3-Iron",
          onClick: () => handleChange("iron"),
          value: "iron",
        },
        {
          title: "4-Epic",
          onClick: () => handleChange("epic"),
          value: "epic",
        },
        {
          title: "5-Legendary",
          onClick: () => handleChange("legendary"),
          value: "legendary",
        },
      ],
    },
    {
      title: "Limited Edition",
      onClick: () => handleChange("limited_edition"),
      slideButton: true,
      value: "limited_edition",
    },
    {
      title: "Stats",
      subItems: [
        {
          title: "Attack",
          onClick: () => handleChange("attack"),
          value: "attack",
        },
        {
          title: "Damage",
          onClick: () => handleChange("damage_stats"),
          value: "damage_stats",
        },
        {
          title: "Mages",
          onClick: () => handleChange("mages_stats"),
          value: "mages_stats",
        },
      ],
    },
  ];

  const Reset = () => {
    setFilter({
      trading_cards: true,
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
    <div className="xl:w-1/3 w-full flex flex-col">
      <div className="flex rounded-md border-2 border-primary mb-4 sm:flex-row flex-col">
        {["trading_cards", "packs", "comics"].map((nftType, index) => (
          <div
            className={clsx(
              {
                "bg-primary": filter[nftType],
              },
              "cursor-pointer px-0 py-2 flex-1",
              index !== 2 && "border-r-2 border-primary"
            )}
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                trading_cards: false,
                packs: false,
                comics: false,
                [nftType]: true,
              }))
            }
          >
            <Typography
              type="subTitle"
              className={clsx(
                "text-center",
                {
                  "text-white": filter[nftType],
                },
                {
                  "text-primary": !filter[nftType],
                }
              )}
            >
              {nftType === "trading_cards"
                ? "Trading cards"
                : nftType === "packs"
                ? "Packs"
                : "Comics"}
            </Typography>
          </div>
        ))}
      </div>
      <div className="flex flex-col rounded-md bg-secondary p-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Typography className="text-white font-bold" type="subTitle">
              Filter
            </Typography>
            <Typography
              className="text-primary ml-2 cursor-pointer"
              onClick={() => Reset()}
              type="caption"
            >
              Reset
            </Typography>
          </div>
          <HeartOutlined className="text-primary cursor-pointer" />
        </div>
        <div className="flex flex-col gap-4 xl:w-80">
          {filterItems.map(
            ({ title, subItems, slideButton, value, onClick }, index) => (
              <CollapseMenu key={"filter-" + index} title={title} defaultOpen>
                <div className="flex flex-wrap gap-2 bg-secondary">
                  {slideButton ? (
                    <SlideButton value={filter[value]} onClick={onClick} />
                  ) : (
                    subItems.map((subItem, indexItem) => {
                      return (
                        <div
                          onClick={subItem.onClick}
                          className={clsx(
                            "flex items-center justify-center px-4 py-2 bg-overlay  cursor-pointer",
                            "rounded-md",
                            "text-white",
                            { "bg-primary": filter[`${subItem.value}`] }
                          )}
                        >
                          {subItem.title}
                        </div>
                      );
                    })
                  )}
                </div>
              </CollapseMenu>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersBoard;
