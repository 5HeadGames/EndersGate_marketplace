"use client";

import React, { useState, useEffect } from "react";

import { getTokensAllowed } from "../../common/getAddresses";

import { useDispatch, useSelector } from "react-redux";

import {
  addPassCart,
  editPassCart,
  removePassAll,
  removePassFromCart,
} from "@/redux/actions";

export const BattlePassProgress = ({ show, priceUSD }: any) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-10 items-center justify-center sm:w-4/5 w-full relative overflow-hidden">
      <img
        src="/assets/bgBattlePass.png"
        className="w-full h-full absolute"
        alt=""
      />
      <div className="flex flex-col gap-2 items-center justify-center w-full rounded-2xl p-2 py-4 border-2 border-white relative">
        <img
          src="/assets/eg_battlepass.png"
          className="w-auto sm:h-10 h-8"
          alt=""
        />
        <h2 className="text-xl text-[#b8b8b8] text-center">
          PLAY GAMES TO UNLOCK REWARDS!
        </h2>
        <div className="flex md:flex-row flex-col gap-6 w-full px-8">
          <div className="flex md:flex-col flex-row items-center justify-center gap-2 md:w-48 w-full shrink-0">
            <div className="flex flex-col gap-1 items-center justify-center md:w-full w-1/2">
              <div className="flex flex-col items-center justify-center gap-1 p-2 px-4 border border-[#000000] rounded-md w-full md:h-auto sm:h-52 h-44">
                <img
                  src="/assets/battlepass_free.png"
                  className="sm:w-28 w-20"
                  alt=""
                />
                <h2
                  className="text-[#b8b8b8] font-bold text-md  text-center"
                  style={{ lineHeight: "20px" }}
                >
                  FREE <br /> REWARDS <br /> Unlocked
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 p-1 border border-[#000000] rounded-md w-full">
                <h2 className="text-[#b8b8b8] font-bold text-xs text-center">
                  16 rewards available
                </h2>
                <h2 className="text-[#47e439] font-bold text-md text-center">
                  4/16 UNLOCKED
                </h2>
              </div>
            </div>

            <div className="flex md:flex-col flex-col-reverse gap-1 items-center justify-center md:w-full w-1/2">
              <div className="flex flex-col items-center justify-center gap-1 p-1 border border-[#000000] rounded-md w-full">
                <h2 className="text-[#b8b8b8] font-bold text-xs text-center">
                  Season Starts
                </h2>
                <h2 className="text-[#47e439] font-bold text-md text-center">
                  ⏱️ Coming Soon
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-md md:w-full relative">
                <img
                  src="/assets/bg_battlepass_active.png"
                  className="absolute w-full h-full"
                  alt=""
                />
                <div className="md:p-2 md:pt-4 p-4 w-full flex flex-col items-center justify-center md:gap-1 gap-2 relative md:h-auto sm:h-52 h-44">
                  <img
                    src="/assets/eg_battlepass_logo.png"
                    className="sm:w-28 w-20 md:pt-0 pt-2"
                    alt=""
                  />
                  <img
                    src="/assets/getBattlePass_btn.png"
                    className="cursor-pointer w-full pt-2"
                    onClick={() => {
                      dispatch(removePassAll());
                      dispatch(
                        addPassCart({
                          id: 1,
                          seller: "0x2A441a7B86eF3466C4B78cB5A8c08c836794E2Ab",
                          nft: "0x516F333056A89104d0029F13D84A5e28f3ea6C76",
                          nftId: "1",
                          amount: "1000000000000",
                          priceUSD: priceUSD,
                          tokens: getTokensAllowed().map((i) => i.address),
                          status: "0",
                          name: "EG Battle Pass",
                          color: "#E9D880",
                          quantity: 1,
                        }),
                      );
                      show();
                    }}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 w-full opacity-25 relative md:pr-48">
            <img src="/assets/battlepass_free.png" className="w-44" alt="" />
            <h2 className="text-3xl font-bold text-[#b8b8b8]">Coming Soon</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
