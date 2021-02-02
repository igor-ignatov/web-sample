import React from "react";

import { Button, Card } from "@blueprintjs/core";
import Router from "next/router";
import _ from "lodash";
import { connect } from "react-redux";

import { create_user_api, fetch_dealers_api } from "../operations";

import type { Props, State } from "./types";

class CreateUser extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      roles: [
        { name: "--- Роль ---", code: "" },
        { name: "Администратор", code: "admin" },
        { name: "Менеджер", code: "manager" }
      ],
      name: "",
      login: "",
      email: "",
      phone: "",
      role: "",
      dlr_id: "",
      ready: false,
      busy: false,
      error: false
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.login.length >= 3 && !_.isEmpty(state.role) && state.email.includes("@") && state.email.length > 5 && !_.isEmpty(state.dlr_id)) {
      return { ready: true };
    }

    return { ready: false };
  }

  componentDidMount() {
    const { actions, store } = this.props;

    if (_.isEmpty(store.users_reducer.dealers)) {
      actions.fetch_dealers().catch((error) => console.log(error));
    }
  }

  private create_user = () => {
    const { login, role, name, email, phone, dlr_id } = this.state;
    const { actions } = this.props;

    this.setState({ busy: true, error: false }, () => {
      actions
        .create_user(login, role, name, email, phone, dlr_id)
        .then(() => {
          Router.push("/users");
        })
        .catch((error) => {
          console.log(error);
          this.setState({ busy: false, error: true });
        });
    });
  };

  render() {
    const { roles, error, ready, busy } = this.state;
    const { dealers } = this.props.store.users_reducer;

    return (
      <div className="container">
        <Card className="mt-5">
          <div className="row no-gutters">
            <div className="col-12 p-2">
              <h5 style={{ fontSize: 18 }}>Создать пользователя:</h5>
            </div>
            {error && (
              <div className="col-12 px-2">
                <div className="alert alert-danger d-flex justify-content-center align-items-center mt-3" role="alert" style={{ fontSize: 15 }}>
                  Произошла ошибка
                </div>
              </div>
            )}
            <div className="col-4 p-2">
              <div className="bp3-input-group">
                <input type="text" className="bp3-input" placeholder="Логин" disabled={busy} onChange={(e) => this.setState({ login: e.target.value })} />
              </div>
            </div>
            <div className="col-4 p-2">
              <div className="bp3-input-group">
                <input type="text" className="bp3-input" placeholder="Имя" disabled={busy} onChange={(e) => this.setState({ name: e.target.value })} />
              </div>
            </div>
            <div className="col-4 p-2">
              <div className="bp3-input-group">
                <input type="email" className="bp3-input" placeholder="email" disabled={busy} onChange={(e) => this.setState({ email: e.target.value })} />
              </div>
            </div>
            <div className="col-4 p-2">
              <div className="bp3-input-group">
                <input type="tel" className="bp3-input" placeholder="Номер телефона" disabled={busy} onChange={(e) => this.setState({ phone: e.target.value })} />
              </div>
            </div>
            <div className="col-4 p-2">
              <div className="bp3-select bp3-fill">
                <select onChange={(e) => this.setState({ role: e.target.value })} style={{ width: "100%" }}>
                  {roles.map((rol) => (
                    <option value={rol.code} key={rol.code}>
                      {rol.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-4 p-2">
              <div className="bp3-select bp3-fill">
                <select onChange={(e) => this.setState({ dlr_id: e.target.value })} style={{ width: "100%" }}>
                  <option value="">--- дилер ---</option>
                  {dealers.map((dealer) => {
                    if (dealer.dlr_id !== "0") {
                      return (
                        <option value={dealer.dlr_id} key={dealer._id}>
                          {dealer.name}
                        </option>
                      );
                    }

                    return null;
                  })}
                </select>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-end align-items-center p-2">
              <Button icon="plus" intent="primary" disabled={busy || !ready} loading={busy} onClick={this.create_user}>
                Создать
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: {
      users_reducer: state.users_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetch_dealers: () => dispatch(fetch_dealers_api()),
      create_user: (login: string, role: string, name: string, email: string, phone: string, dlr_id: string) => dispatch(create_user_api(login, role, name, email, phone, dlr_id))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
