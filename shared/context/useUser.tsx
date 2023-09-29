"use client";
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

export interface UserContextData {
  user: any;
  updateUser: (arg1: any) => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = React.useState({
    ethAddress: "",
    email: "",
    provider: undefined,
    providerName: "",
  });

  const _updateUser = useCallback(async (user: any) => {
    try {
      setUser(user);
    } catch (err: any) {
      console.log(err.message);
      toast.error(err.message);
    }
  }, []);

  const updateUser = useCallback(
    (blockchain: any) => {
      _updateUser(blockchain);
    },
    [_updateUser],
  );

  const value = useMemo(
    () => ({
      user,
      updateUser,
    }),
    [user, updateUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("error");
  }
  return context;
};
