import { getNativeByChain } from "@shared/helpers/networks";
import { useEffect, useMemo, useState } from "react";

export const useNativeBalance = (options) => {
  const [balance, setBalance] = useState({ inWei: 0, formatted: 0 });

  return {
    getBalance: () => 1,
    balance: 1,
    nativeName: "some name",
    isLoading: false,
  };
};
