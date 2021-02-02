/* eslint-disable react/no-danger */
import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <html lang="ru">
        <Head title="MATRIX mobile">
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#FF7700" />
          <meta name="description" content="MATRIX mobile" />
          <meta name="format-detection" content="telephone=no" />
          <link href="/static/favicon.ico" rel="shortcut icon" type="image/x-icon" />
          <link href="/static/favicon.svg" rel="icon" type="image/svg+xml" />

          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        </Head>
        <body className="bp3-dark mtx-dark-container">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
