import React from "react";
import Head from "next/head";
import type {AppProps} from "next/app";
import "shared/styles/global-tailwind.css";
import "shared/styles/index.css";
import "shared/styles/style.css";
import Layout from "shared/components/Layouts";
import {store} from "redux/store";
import {Provider} from "react-redux";

const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <Head>
        <title>Ender's Gate</title>
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
};

export default MyApp;
