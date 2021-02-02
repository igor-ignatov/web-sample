import React from "react";

import { Switch } from "@blueprintjs/core";

import { connect } from "react-redux";
import { toggle_theme_api } from "./actions";

import type { IRootState } from "../../redux/types";

class ThemeToggle extends React.Component<{ store?: IRootState; actions?: any }, {}> {
  private toggle_theme = () => {
    const { store, actions } = this.props;
    const { theme } = store.global_site_reducer;
    const body = document.querySelectorAll("body")[0];

    if (body) {
      if (theme === "bp3-dark") {
        body.classList.remove(...["bp3-dark", "mtx-dark-container"]);
        body.classList.add(...["bp3-light"]);
      } else {
        body.classList.remove(...["bp3-light"]);
        body.classList.add(...["bp3-dark", "mtx-dark-container"]);
      }
    }

    window.localStorage.setItem("theme", theme === "bp3-dark" ? "bp3-light" : "bp3-dark");
    actions.toggle_theme(theme === "bp3-dark" ? "bp3-light" : "bp3-dark");
  };

  render() {
    const { store } = this.props;
    const { theme } = store.global_site_reducer;

    return <Switch innerLabel={theme === "bp3-dark" ? "dark" : "light"} onChange={this.toggle_theme} style={{ margin: 0, outline: "none" }} large checked={theme === "bp3-light"} />;
  }
}

function mapStateToProps(state: IRootState) {
  return {
    store: {
      global_site_reducer: state.global_site_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      toggle_theme: (theme) => dispatch(toggle_theme_api(theme))
    }
  };
}

export default connect<any, any>(mapStateToProps, mapDispatchToProps)(ThemeToggle);
