import React from "react";

const Partners = () => {
  const partners = [
    { logo: "/icons/skl.webp", link: "https://skale.space/" },
    { logo: "/icons/Chainlink.svg", link: "https://chain.link/" },
    { logo: "/icons/Chainstack.svg", link: "https://chainstack.com/" },
    { logo: "/icons/DappRadar.svg", link: "https://dappradar.com/" },
    {
      logo: "/icons/Tsuburaya_Logo_Blue.png",
      link: "https://tsuburaya-prod.com/",
    },
    { logo: "/icons/Polygon.svg", link: "https://polygon.technology/" },
    { logo: "/icons/XP.Network.svg", link: "https://xp.network/" },
    { logo: "/icons/magic-link.png", link: "https://magic.link/" },
  ];
  return (
    <div className="py-10 xl:px-10 px-4 flex flex-col items-center border-t border-overlay-border bg-overlay-3">
      <img src="/icons/5HGPARTNERS.svg" className="w-40 mb-6" alt="" />

      <div className="flex flex-wrap gap-x-10 sm:gap-y-8 gap-y-4 items-center justify-center">
        {partners.map(({ logo, link }) => (
          <a href={link} target="_blank" rel="noreferrer">
            <img alt="" className="w-[8rem]" src={logo} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Partners;
