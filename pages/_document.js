import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";

export default class MyDocument extends Document {
  render() {
    const description = "Will's super cool code challenge";
    return (
      <Html lang="en">
        <Head>
          <title>{description}</title>
          <meta content={description} name="description" />
          <meta content={description} name="keywords" />
          <meta content={description} key="og:title" property="og:title" />
          <meta
            content={description}
            key="og:description"
            property="og:description"
          />
          <meta
            content={description}
            key="twitter:description"
            name="twitter:description"
          />
          <meta
            content={description}
            key="twitter:title"
            name="twitter:title"
          />
          <meta content="website" property="og:type" />
          <meta content={description} property="og:site_name" />
          <meta content="en_US" property="og:locale" />
          <meta content="summary" name="twitter:card" />
          <meta content="index,follow" name="robots" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
