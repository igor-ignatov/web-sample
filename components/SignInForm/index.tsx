import React, { useState } from "react";

import { Button } from "@blueprintjs/core";
import ClipLoader from "react-spinners/ClipLoader";

import { connect } from "react-redux";
import { sign_in_api } from "./operations";

interface Props {
  actions: any;
}

const SignInForm: React.FC<Props> = ({ actions }) => {
  const [login, set_login] = useState<string>("");
  const [password, set_password] = useState<string>("");
  const [busy, set_busy] = useState<boolean>(false);
  const [error, set_error_state] = useState<boolean>(false);

  return (
    <div className="row justify-content-center align-items-center my-5 py-5">
      {error && (
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="alert alert-danger" role="alert">
            Неправильный логин или пароль
          </div>
        </div>
      )}
      <div className="col-5 sign-in-form">
        <div className="bp3-input-group mb-3">
          <input disabled={busy} type="text" className="bp3-input" placeholder="Логин" id="login" aria-describedby="login" onChange={(e) => set_login(e.target.value)} />
        </div>
        <div className="bp3-input-group mb-3">
          <input disabled={busy} type="password" className="bp3-input" placeholder="Пароль" id="password" onChange={(e) => set_password(e.target.value)} />
        </div>
        <Button
          disabled={login.length < 3 || password.length < 3 || busy}
          loading={busy}
          fill
          intent="warning"
          onClick={async () => {
            set_busy(true);
            actions.sign_in(login, password).catch(() => {
              set_error_state(true);
              set_busy(false);
            });
          }}>
          Вход
        </Button>
      </div>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      sign_in: (login: string, pass: string) => dispatch(sign_in_api(login, pass))
    }
  };
}

export default connect(null, mapDispatchToProps)(SignInForm);
