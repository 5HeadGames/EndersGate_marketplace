import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "shared/styles/global-tailwind.css";
import "shared/styles/index.css";
import "shared/styles/style.css";
import QuickStart from "shared/components/QuickStart";
import Layout from "shared/components/Layouts";
import { store } from "redux/store";
import { Provider } from "react-redux";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const content = <Component {...pageProps} />;
  return (
    <>
      <Head>
        <title>Ender's Gate</title>
      </Head>
      <Layout>
        <Provider store={store}>{content}</Provider>
      </Layout>
    </>
  );
};

export default MyApp;
