import React from "react";

import Router from "next/router";
import { Navbar, Button, Alignment } from "@blueprintjs/core";
import ThemeToggle from "../ThemeToggle";

import LogoutButton from "../SignInForm/Logout";

import { connect } from "react-redux";

import type { IRootState } from "../../redux/types";
import type { ISession } from "../../common/types/session";

const Header: React.FC<{ store: IRootState; session: ISession }> = ({ session, store }) => {
  const { theme } = store.global_site_reducer;
  const routes: Array<{ name: string; path: string; role?: string; icon: any }> = [
    {
      name: "Номера",
      path: "/",
      icon: ""
    },
    {
      name: "Активации",
      path: "/activations",
      icon: ""
    },
    {
      name: "Пользователи",
      path: "/users",
      role: "god",
      icon: ""
    }
  ];
  const { user } = session;

  return (
    <Navbar className="bp3-dark" style={theme === "bp3-dark" ? { background: "#24303b" } : { background: "#111" }}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading style={{ padding: 0 }}>
          <Button onClick={() => Router.push("/")} style={{ padding: 0, background: "transparent" }} minimal large>
            <img src="/static/images/logo-o.png" className="mtx-logo" />
          </Button>
        </Navbar.Heading>
        <Navbar.Divider />
        {session.detail && <Button onClick={() => Router.push(`/${session.detail}`)} className="bp3-minimal" icon="chevron-left" text={session.detail} />}
        {routes.map((route) => (!route.role || (route.role === user.role)) && <Button key={route.path} onClick={() => Router.push(route.path)} className="bp3-minimal" text={route.name} />)}
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <ThemeToggle />
        <Navbar.Heading style={{ fontSize: 14 }}>{user.name}</Navbar.Heading>
        <Navbar.Heading>
          <LogoutButton />
        </Navbar.Heading>
      </Navbar.Group>
    </Navbar>
  );
};

function mapStateToProps(state: IRootState) {
  return {
    store: {
      global_site_reducer: state.global_site_reducer
    }
  };
}

export default connect(mapStateToProps, null)(Header);
