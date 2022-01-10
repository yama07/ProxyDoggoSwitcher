import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "../lib/theme";
import { SystemPropertiesProvider } from "../contexts/SystemPropertiesContext";

const _app = function (props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <SystemPropertiesProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </SystemPropertiesProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default _app;
