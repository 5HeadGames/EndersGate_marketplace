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
import {ToastProvider} from "react-toast-notifications";

const MyApp = ({Component, pageProps}: AppProps) => {
  const appId = process.env.NEXT_PUBLIC_APP_ID;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  return (
    <>
      <Head>
        <title>Ender's Gate</title>
      </Head>
      <Provider store={store}>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
          <ToastProvider autoDismiss placement="bottom-center">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ToastProvider>
        </MoralisProvider>
        ,
      </Provider>
    </>
  );
};

export default MyApp;
