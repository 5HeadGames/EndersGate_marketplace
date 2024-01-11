import { WalletOutlined } from "@ant-design/icons";
import { getSFUEL } from "@shared/web3";
import React from "react";
import { Button } from "./button";

export const ButtonSFUEL = ({ user }) => {
  const [justClicked, setJustClicked] = React.useState(false);
  return (
    <Button
      type="submit"
      decoration="line-white"
      className="rounded-xl bg-overlay-2 text-white hover:text-overlay text-[12px] border border-overlay-border py-1 px-3 whitespace-nowrap mt-2"
      onClick={() => {
        setJustClicked(true);
        getSFUEL(user);
        setTimeout(() => {
          setJustClicked(false);
        }, 10000);
      }}
      disabled={justClicked}
    >
      Get sFUEL
    </Button>
  );
};

export const ButtonSFUELCart = ({ user }) => {
  const [justClicked, setJustClicked] = React.useState(false);
  return (
    <Button
      type="submit"
      decoration="line-white"
      className="text-center rounded-xl p-2 border w-auto text-white hover:text-black transition-all duration-500 relative whitespace-nowrap"
      onClick={() => {
        setJustClicked(true);
        getSFUEL(user);
        setTimeout(() => {
          setJustClicked(false);
        }, 5000);
      }}
      disabled={justClicked}
    >
      Get sFUEL
    </Button>
  );
};
