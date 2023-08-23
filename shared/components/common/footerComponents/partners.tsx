import React from "react";
import partnersbg from "/icons/partnersbg.svg";

const Partners = () => {
  const partners = [
    { logo: "/icons/Chainlink.svg", link: "https://chain.link/" },
    { logo: "/icons/Chainstack.svg", link: "https://chainstack.com/" },
    { logo: "/icons/DappRadar.svg", link: "https://dappradar.com/" },
    { logo: "/icons/Polygon.svg", link: "https://polygon.technology/" },
    { logo: "/icons/XP.Network.svg", link: "https://xp.network/" },
  ];
  return (
    <div className="py-10 px-10 flex flex-col items-center border-t border-overlay-border bg-overlay-3">
      <img src="/icons/5HGPARTNERS.svg" className="w-40 mb-6" alt="" />

      <div className="flex flex-wrap gap-x-10 gap-y-8 items-center justify-center">
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
