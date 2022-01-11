import React from "react";
import {AppstoreOutlined, UnorderedListOutlined} from "@ant-design/icons";

import {CollapseMenu} from "@shared/components/common/collapseMenu/collapseMenu";
import {Icons} from "@shared/const/Icons";
import {getNftsMetadata} from "shared/web3";
import ItemDashboard from "./item/item";
import NftCard from 'shared/components/Marketplace/itemCard'
import FiltersBoard from "./filters/filters";
import Styles from "./styles.module.scss";
import clsx from "clsx";

const MarketplaceComponent = () => {
  const [currentOrder, setCurrentOrder] = React.useState("lowest_price");

  const orderMapper = {
    lowest_price: 'Lowest Price',
    highest_price: 'Highest Price',
    recently_listed: 'Recently Listed',
    older_listed: 'Older Listed',
  }

  const [filter, setFilter] = React.useState({
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

  return (
    <div className="w-full flex xl:flex-row flex-col md:px-8 px-4 pt-36 pb-10">
      <FiltersBoard filter={filter} setFilter={setFilter} />
      <div className="xl:w-2/3 xl:mt-0 mt-6 flex flex-col">
        <div >
          <div className="w-full flex justify-between sm:flex-row flex-col">
            <h3 className="text-2xl text-primary ml-4">619,801 Axies</h3>
            <div className="flex">
              <CollapseMenu title={orderMapper[currentOrder]} classes={{container: 'border border-primary border-2 p-2 rounded-md', root: 'mr-4'}}>
                <div className="bg-secondary flex flex-col justify-center items-center z-100 cursor-pointer">
                  {["lowest_price", "highest_price", "recently_listed", "older_listed"].map(
                    (title) => (
                      <div className='p-2 text-primary hover:bg-primary hover:text-secondary w-full text-center' onClick={() => setCurrentOrder(title)}>
                        {orderMapper[title]}
                      </div>
                    )
                  )}
                </div>
              </CollapseMenu>
              <div className=" border-2 border rounded-md border-primary flex justify-center items-center text-primary h-10">
                <div className="flex flex-1 justify-center items-center text-primary h-10 border-r-2 border-primary p-2 cursor-pointer hover:bg-primary hover:text-secondary">
                  <AppstoreOutlined />
                </div>
                <div className="flex flex-1 justify-center items-center text-primary h-10 p-2 cursor-pointer hover:bg-primary hover:text-secondary">
                  <UnorderedListOutlined />
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap w-full justify-center items-center'>
            {
              new Array(6).fill(0).map(() => (
                <NftCard classes={{root: 'm-4'}} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComponent;
