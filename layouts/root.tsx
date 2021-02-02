import React, { useEffect } from "react";

import Header from "../components/Header";

import { connect } from "react-redux";

import { toggle_theme_api } from "../components/ThemeToggle/actions";
import { set_user_data } from "./actions";
import { subscribe_session } from "../components/SignInForm/operations";

import type { ISession } from "../common/types/session";
import type { IRootState } from "../redux/types";

interface Props {
  children: React.ReactNode;
  session: ISession;
  store: IRootState;
  actions: any;
}

const RootLayout: React.FC<Props> = ({ children, session, store, actions }) => {
  const { user_data } = store.global_site_reducer;

  useEffect(() => {
    const { theme } = store.global_site_reducer;

    if (window) {
      actions.subscribe_session();

      const saved = window.localStorage.getItem("theme");

      if (saved && theme !== saved) {
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

        actions.toggle_theme(saved);
      }
    } else {
      console.log("eeeee", window);
    }
  }, []);

  useEffect(() => {
    actions.set_user_data(session.user);
  }, [user_data]);

  return (
    <>
      <Header session={session} />
      <section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
};

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
      subscribe_session: () => dispatch(subscribe_session()),
      toggle_theme: (theme) => dispatch(toggle_theme_api(theme)),
      set_user_data: (data) => dispatch(set_user_data(data))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RootLayout);
