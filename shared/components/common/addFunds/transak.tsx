import { ChevronLeftIcon, XIcon } from "@heroicons/react/solid";
import { Icons } from "@shared/const/Icons";
import React from "react";
import { useSelector } from "react-redux";

const Transak = ({ hide, amount, token, wallet, network }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="flex flex-col w-auto rounded-xl border border-overlay-border overflow-hidden relative">
        <h1 className="text-white font-bold text-5xl py-4 px-4 text-center w-full border-b border-overlay-border">
          On-Ramp
        </h1>
        <div className="text-white absolute top-5 left-3">
          <ChevronLeftIcon onClick={hide} className="w-10 cursor-pointer" />
        </div>
        <iframe
          id="transakIframe"
          src={`https://global.transak.com?apiKey=${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}&walletAddress=${wallet}&redirectURL=https://marketplace.endersgate.gg/&defaultCryptoAmount=${amount}&cryptoCurrencyCode=${token}&network=${network}&defaultFiatCurrency=USD`}
          allow="camera;microphone;payment"
          style={{ height: "60vh", width: "500px", border: "none" }}
        ></iframe>
        <div className="flex gap-6 justify-between items-center text-md text-xl py-2 px-8 border-y border-transparent-color-gray-200 bg-transparent w-full">
          <div className="flex gap-1 items-center">
            <img src={Icons.logo} className="w-8 h-8" alt="" />
            <h3
              className="text-[12px] text-primary-disabled font-[700]"
              style={{ lineHeight: "14px" }}
            >
              Total price on <br />
              <span className="text-red-primary font-bold">5</span>
              <span className="text-white font-bold">HG</span> Shop:
            </h3>
          </div>
          <div className="flex flex-col gap items-end">
            <h3
              className="text-sm font-[700] text-white flex gap-1 items-center justify-center"
              style={{ fontSize: "14px" }}
            >
              {amount} {token}{" "}
              <img src={`/images/matic.png`} className="w-3 h-3" alt="" />
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transak;
