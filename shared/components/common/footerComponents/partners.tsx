import React from "react";
import partnersbg from "/icons/partnersbg.svg";

const Partners = () => {
  const partners = [
    { logo: "/icons/Harmony.svg", link: "https://harmony.one/" },
    { logo: "/icons/Chainlink.svg", link: "https://chain.link/" },
    { logo: "/icons/DappRadar.svg", link: "https://dappradar.com/" },
    { logo: "/icons/Polygon.svg", link: "https://polygon.technology/" },
    { logo: "/icons/XP.Network.svg", link: "https://xp.network/" },
  ];
  return (
    <div className="py-10 px-10 flex flex-col">
      <p className="text-xl text-white font-bold">OUR PARTNERS</p>

      <div className="flex flex-wrap gap-x-10 gap-y-4 items-center justify-center">
        {partners.map(({ logo, link }) => (
          <a href={link} target="_blank" rel="noreferrer">
            <img alt="" className="w-[11rem]" src={logo} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Partners;
