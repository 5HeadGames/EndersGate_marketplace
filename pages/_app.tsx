import React from "react";
import Head from "next/head";
import type {AppProps} from "next/app";
import "shared/styles/index.css";
import "shared/styles/style.css";
import QuickStart from "shared/components/QuickStart";
import Layout from "shared/components/Layouts";

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
        <>
            <Head>
                <title>Ender's Game</title>
            </Head>
            <Layout>
                {content}
            </Layout>
        </>
    );
};

export default MyApp;

