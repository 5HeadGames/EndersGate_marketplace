import React from "react";
import Head from "next/head";
import type {AppProps} from "next/app";
import "shared/styles/global-tailwind.css";
import "shared/styles/index.css";
import "shared/styles/style.css";
import Layout from "shared/components/Layouts";
import {store} from "redux/store";
import {Provider} from "react-redux";
import {MoralisProvider} from "react-moralis";

const {ToastProvider} = require("react-toast-notifications"); //it throws ts error

const MyApp = ({Component, pageProps}: AppProps & {Component: any}) => {
  const appId = "qAmSPQcK8lZHIAKRlNF6XlJhMtb83CSabtxOKQc7";
  const serverUrl = "https://lutnjdss5zjx.moralishost.com:2053/server";
  return (
    <>
      <Head>
        <title>Ender's Gate Marketplace</title>
      </Head>
      <Provider store={store}>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
          <ToastProvider autoDismiss placement="bottom-center">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ToastProvider>
        </MoralisProvider>
      </Provider>
    </>
  );
};

export default MyApp;
