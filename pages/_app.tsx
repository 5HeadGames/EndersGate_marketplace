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

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [loaded,setLoaded] = React.useState(false)

  React.useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    };
    console.log(firebaseConfig)

    const app = firebase.initializeApp(firebaseConfig);
    setLoaded(true)
  }, []);

  return (
    <>
      <Head>
        <title>Ender's Gate</title>
      </Head>
      <Layout>
        <Provider store={store}>
          {
          loaded && <Component {...pageProps} />
          }
        </Provider>
      </Layout>
    </>
  );
};

export default MyApp;
