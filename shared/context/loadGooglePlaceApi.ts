import { createContext } from "react";

interface LoadGooglePlaceAPIContextInterface {
  onLoadGooglePlaceAPI: boolean;
  setOnLoadGooglePlaceAPI:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
}

export const GooglePlaceAPIContext =
  createContext<LoadGooglePlaceAPIContextInterface>({
    onLoadGooglePlaceAPI: false,
    setOnLoadGooglePlaceAPI: () => null,
  });
