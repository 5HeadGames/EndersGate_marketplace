"use client";
"use client";
import React from "react";
import "shared/styles/global-tailwind.css";
import "shared/styles/index.scss";
import "shared/styles/style.scss";
import "shared/styles/packs.scss";
import "shared/styles/comics.scss";
import Layout from "shared/components/Layouts";
import { store } from "redux/store";
import { Provider } from "react-redux";
import Web3Provider from "@shared/components/Web3Provider";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { initializeApp } from "firebase/app";
import { BlockchainContextProvider } from "@shared/context/useBlockchain";
import "swiper/css";
import { UserContextProvider } from "@shared/context/useUser";

export default function RootLayout({ children }: { children: any }) {
  const theme = extendTheme({
    colors: {
      primary: "#D2A2FF",
      secondary: "rgba(50,50,50,255)",
      menu: "#292832",
      elemental: "rgba(8,8,19,255)",
      water: "#93dbff",
      nftbg: "#A48C66",
      roadmap: "#080813",
      footer: "#171717",
      gold: "#bc8b30",
      yellow: "#FFAB10",
      fire: "#ffbb88",
      earth: "#9f8a7e",
      venom: "#8cffaf",
      mystic: "#b9c6c7",
      void: "#c87cfc",
    },
    fonts: {
      poppins: "Poppins",
    },
  });

  const firebaseConfig = {
    apiKey: "AIzaSyCtkRgLKQD7vMLqf9v4iNqWclGaRW8z2Zs",
    authDomain: "endersgate-1ff81.firebaseapp.com",
    databaseURL: "https://endersgate-1ff81-default-rtdb.firebaseio.com",
    projectId: "endersgate-1ff81",
    storageBucket: "endersgate-1ff81.appspot.com",
    messagingSenderId: "248387184050",
    appId: "1:248387184050:web:b872255ff8f7375880f0ab",
    measurementId: "G-K1H6HYR0C8",
  };

  const app = initializeApp(firebaseConfig);

  return (
    <html lang="en">
      <head>
        <title>Enders Gate Marketplace</title>
      </head>

      <body
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <Provider store={store}>
          <UserContextProvider>
            <BlockchainContextProvider>
              <ChakraProvider theme={theme}>
                <Web3Provider>
                  <Layout>
                    {children}
                    <Toaster containerClassName="!z-[100000000]" />
                  </Layout>
                </Web3Provider>
              </ChakraProvider>
            </BlockchainContextProvider>
          </UserContextProvider>
        </Provider>
      </body>
    </html>
  );
}
