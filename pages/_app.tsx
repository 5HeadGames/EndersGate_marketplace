import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "shared/styles/global-tailwind.css";
import "shared/styles/index.scss";
import "shared/styles/style.scss";
import Layout from "shared/components/Layouts";
import { store } from "redux/store";
import { Provider } from "react-redux";
import Web3Provider from "@shared/components/Web3Provider";

const { ToastProvider } = require("react-toast-notifications"); //it throws ts error

const MyApp = ({ Component, pageProps }: AppProps & { Component: any }) => {
  // const appId = "qAmSPQcK8lZHIAKRlNF6XlJhMtb83CSabtxOKQc7";
  // const serverUrl = "https://lutnjdss5zjx.moralishost.com:2053/server";
  return (
    <>
      <Head>
        <title>Ender's Gate Marketplace</title>
      </Head>
      <Provider store={store}>
        <ToastProvider autoDismiss placement="bottom-center">
          <Web3Provider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Web3Provider>
        </ToastProvider>
      </Provider>
    </>
  );
};

export default MyApp;
