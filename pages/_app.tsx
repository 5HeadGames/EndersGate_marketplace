import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "shared/styles/index.css";
import "shared/styles/style.css";
import QuickStart from "shared/components/QuickStart";
import Layout from "shared/components/Layouts";
import { store } from "redux/store";
import { Provider } from "react-redux";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

const MyApp = ({ Component, pageProps }: AppProps) => {
    const isServerInfo = APP_ID && SERVER_URL ? true : false;

    const content = isServerInfo ? (
        <Component {...pageProps} />
    ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <QuickStart isServerInfo={false} />
        </div>
    );

    return (
<<<<<<< HEAD
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <MoralisDappProvider>
          <Head>
            <title>Ender's Game</title>
          </Head>
          <Layout>{content}</Layout>
        </MoralisDappProvider>
      </MoralisProvider>
=======
        <>
            <Head>
                <title>Ender's Gate</title>
            </Head>
            <Layout>
                <Provider store={store}>{content}</Provider>
            </Layout>
        </>
>>>>>>> 4b48c2ab2f30dfcb9f793b22b56d11c4f184ed2c
    );
};

export default MyApp;
