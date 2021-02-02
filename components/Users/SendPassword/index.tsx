import React from "react";

import { Button } from "@blueprintjs/core";
import ClipLoader from "react-spinners/ClipLoader";

import { connect } from "react-redux";

import { resend_user_password_api } from "../operations";

import { IUser } from "../../../common/types/session";

interface Props {
  actions: any;
  user: IUser;
}

interface State {
  error: boolean;
  success: boolean;
  busy: boolean;
}

class SendUserPassword extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      success: false,
      busy: false
    };
  }

  __timeout;

  __send_pass = () => {
    const { user, actions } = this.props;

    if (this.__timeout) {
      clearTimeout(this.__timeout);
    }

    this.setState({ busy: true, success: false, error: false }, () => {
      actions
        .resend_user_password(user._id)
        .then((res) => {
          this.setState({ success: true, busy: false }, () => {
            this.__timeout = setTimeout(() => {
              this.setState({ busy: false, success: false, error: false });
            }, 3000);
          });
        })
        .catch(() => {
          this.setState({ error: true, busy: false }, () => {
            this.__timeout = setTimeout(() => {
              this.setState({ busy: false, success: false, error: false });
            }, 3000);
          });
        });
    });
  };

  componentWillUnmount() {
    if (this.__timeout) {
      clearTimeout(this.__timeout);
    }
  }

  render() {
    const { user } = this.props;
    const { success, error, busy } = this.state;
    let color = "btn-outline-dark";
    let text = "Выслать пароль";

    if (success) {
      color = "btn-success";
      text = "Пароль выслан";
    } else if (error) {
      color = "btn-danger";
      text = "Ошибка";
    }

    console.log("color", color);
    return user.email ? (
      <Button
        disabled={busy}
        icon="send-message"
        small
        loading={busy}
        onClick={this.__send_pass}
      >
        {text}
      </Button>
    ) : null;
  }
}

function mapSateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      resend_user_password: (_id) => dispatch(resend_user_password_api(_id))
    }
  };
}

export default connect(mapSateToProps, mapDispatchToProps)(SendUserPassword);
