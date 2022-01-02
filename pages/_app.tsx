import React from "react";
import Head from "next/head";
import type {AppProps} from "next/app";
import {MoralisProvider} from "react-moralis";
import "shared/styles/index.css";
import "shared/styles/style.css";
import QuickStart from "shared/components/QuickStart";
import Layout from "shared/components/Layouts";
import {MoralisDappProvider} from "../shared/providers/MoralisDappProvider/MoralisDappProvider";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

const MyApp = ({Component, pageProps}: AppProps) => {
    const isServerInfo = APP_ID && SERVER_URL ? true : false;

    const content = isServerInfo ? (
        <Component {...pageProps} />
    ) : (
        <div style={{display: "flex", justifyContent: "center"}}>
            <QuickStart isServerInfo={false} />
        </div>
    );

    return (
        <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
            <MoralisDappProvider>
                <Head>
                    <title>Ender's Game</title>
                </Head>
                <Layout>
                    {content}
                </Layout>
            </MoralisDappProvider>
        </MoralisProvider>
    );
};

export default MyApp;

