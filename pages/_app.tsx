/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

import Router from "next/router";
import NProgress from "nprogress";
import wrapper from "../redux/store";

import "bootstrap/dist/css/bootstrap-grid.min.css";
import "../sass/index.scss";

import "../lib/css/ngprogress.css";

class App extends React.Component<{ Component: any; pageProps: any }, {}> {
  componentDidMount() {
    NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

    Router.events.on("routeChangeStart", this.routeChangeStart);
    Router.events.on("routeChangeComplete", this.routeChangeEnd);
    Router.events.on("routeChangeError", this.routeChangeEnd);
  }

  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.routeChangeStart);
    Router.events.off("routeChangeComplete", this.routeChangeEnd);
    Router.events.off("routeChangeError", this.routeChangeEnd);
  }

  routeChangeStart = () => {
    NProgress.start();
  };

  routeChangeEnd = () => {
    NProgress.done();
  };

  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default wrapper.withRedux(App);
