/* eslint-disable react-hooks/exhaustive-deps */
import { ReloadOutlined } from "@ant-design/icons";
import { XIcon } from "@heroicons/react/solid";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useModal } from "@shared/hooks/modal";
import React from "react";
import { Button } from "../button";
import Transak from "./transak";

export const AddFundsModal = ({
  hide,
  amount,
  token,
  wallet,
  balance,
  loading,
  onClick,
  network,
  reload,
  tokenSelected,
}) => {
  const { Modal, show, isShow, hide: hideTransak } = useModal();
  const { blockchain } = useBlockchain();
  return (
    <>
      <Modal isShow={isShow} withoutX>
        <Transak
          hide={hideTransak}
          amount={amount}
          token={token}
          wallet={wallet}
          network={network}
        />
      </Modal>
      <div className="flex flex-col relative max-w-[450px] px-10 rounded-xl border border-primary-disabled py-6 bg-overlay">
        <div className="text-white absolute top-2 left-2">
          <ReloadOutlined
            onClick={reload}
            className="w-6 h-6 cursor-pointer text-xl"
          />
        </div>
        <div className="text-white absolute top-2 right-2">
          <XIcon onClick={hide} className="w-6 h-6 cursor-pointer"></XIcon>
        </div>
        <div className="text-center text-xl font-bold text-white pb-8">
          Add funds to purchase
        </div>
        <p className="text-center text-xl font-bold text-white">
          You need ({amount}) {token} +{" "}
          {blockchain !== "skl" && (
            <span className="text-green-button">gas fees</span>
          )}
        </p>
        <p className="text-center text-sm text-white py-4">
          Add funds to your wallet or add funds with a card. Balance updates may
          take up to a minute.
        </p>
        <div className="flex flex-col w-full pb-4">
          <div className="w-full flex justify-between pb-1">
            <p className="text-center text-sm text-white font-bold">
              Your Wallet:
            </p>
            <p className="text-center text-sm text-white">
              Balance: {balance} {token}
            </p>
          </div>
          <p className="w-full py-2 px-3 border text-white whitespace-nowrap text-xs font-bold border-primary-disabled rounded-full">
            {wallet}
          </p>
        </div>
        <Button
          decoration="fill"
          className="w-full md:text-lg text-md py-[6px] rounded-full !text-overlay !bg-green-button !font-bold hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
          onClick={onClick}
          disabled={loading}
        >
          Continue
        </Button>
        {tokenSelected.transak ? (
          <div
            className="text-[16px] text-green-button font-bold flex items-center justify-center gap-2 cursor-pointer pt-2"
            onClick={() => {
              show();
            }}
          >
            <img src="/icons/wallet.png" className="w-6 pb-2" alt="" /> Add
            funds to your wallet
          </div>
        ) : (
          <a
            className="text-[16px] text-green-button font-bold flex items-center justify-center gap-2 cursor-pointer pt-2"
            href={tokenSelected.link}
            target={"_blank"}
          >
            <img src="/icons/wallet.png" className="w-6 pb-2" alt="" /> Add
            funds to your wallet
          </a>
        )}
      </div>
    </>
  );
};
