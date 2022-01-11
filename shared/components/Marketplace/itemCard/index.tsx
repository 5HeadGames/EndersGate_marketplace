import React from "react";
import clsx from 'clsx'
import {Icons} from "@shared/const/Icons";

interface Props {
  classes?:Partial<Record<'root',string>>;
}

const NFTCard: React.FunctionComponent<Props> = (props) => {
  const {classes} = props
  return (
    <div className={clsx("bg-purple-900/25 rounded-xl p-4 flex flex-col text-white",classes?.root)}>
      <div className="w-full flex flex-col">
        <div className="bg-primary p-2 rounded-md">
          <span>#234243982743</span>
        </div>
        <div>
          <span>Axie #1235</span>
        </div>
        <div>
          <span>Breed count:4</span>
        </div>
      </div>
      <div className='w-full h-30'>
        <img src={Icons.logo} className='w-24 h-24'/>
    </div>
        <div className='flex flex-col'>
          <span>0.0017</span>
          <span>$253.77</span>
        </div>
    </div>
  );
};

export default NFTCard;
