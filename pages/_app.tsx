import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "shared/styles/global-tailwind.css";
import "shared/styles/index.scss";
import "shared/styles/style.scss";
import "shared/styles/packs.scss";
import Layout from "shared/components/Layouts";
import { store } from "redux/store";
import { Provider } from "react-redux";
import Web3Provider from "@shared/components/Web3Provider";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const { ToastProvider } = require("react-toast-notifications"); //it throws ts error

const MyApp = ({ Component, pageProps }: AppProps & { Component: any }) => {
  // const appId = "qAmSPQcK8lZHIAKRlNF6XlJhMtb83CSabtxOKQc7";
  // const serverUrl = "https://lutnjdss5zjx.moralishost.com:2053/server";

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

  return (
    <>
      <Head>
        <title>Ender's Gate Marketplace</title>
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <ToastProvider autoDismiss placement="bottom-center">
            <Web3Provider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Web3Provider>
          </ToastProvider>
        </ChakraProvider>
      </Provider>
    </>
  );
};

export default MyApp;
