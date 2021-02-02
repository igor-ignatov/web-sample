import React from "react";

import { Button } from "@blueprintjs/core";
import ClipLoader from "react-spinners/ClipLoader";
import MaskedInput from "react-text-mask";

import _ from "lodash";
import { connect } from "react-redux";

import { activate_number_api } from "./operations";

import type { Props, State } from "./types";

class AcceptNumber extends React.Component<Props, State> {
  private _inputRef = React.createRef<HTMLInputElement>();

  constructor(props) {
    super(props);

    this.state = {
      busy: false,
      error: false,
      company_name: "",
      inn: "",
      contract_number: "MTX",
      contract: ""
    };
  }

  private _send = (): void => {
    const { company_name, inn, contract_number } = this.state;
    const { actions, number } = this.props;

    const form_data = new FormData();
    form_data.append("contract", this._inputRef.current.files[0]);
    form_data.append("number", number.number);
    form_data.append("company_name", company_name);
    form_data.append("inn", inn);
    form_data.append("contract_number", contract_number);

    this.setState({ busy: true, error: false }, () => {
      actions
        .activate_number(form_data)
        .then((resp) => {
          console.log(resp);
          this.setState({ busy: false });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ busy: false, error: true });
        });
    });
  };

  render() {
    const { busy, company_name, inn, contract_number, contract, error } = this.state;

    return (
      <>
        <h5 style={{ marginBottom: 10 }}>Активировать контракт</h5>
        {error && (
          <div className="col-12 mb-3">
            <div className="alert alert-danger" role="alert" style={{ fontSize: 14 }}>
              Произошла ошибка
            </div>
          </div>
        )}

        <div className="bp3-input-group" style={{ marginBottom: 10 }}>
          <input type="text" className="bp3-input" placeholder="Название компании" onChange={(e) => {
            if (new RegExp("[A-Za-z]", "g").test(e.target.value)) {
              return;
            }

            this.setState({ company_name: e.target.value });
          }
          } value={company_name} disabled={busy} />
        </div>

        <div className="bp3-input-group" style={{ marginBottom: 10 }}>
          <input type="text" className="bp3-input" placeholder="ИНН" onChange={(e) => this.setState({ inn: e.target.value })} value={inn} disabled={busy} />
        </div>

        <div className="bp3-input-group" style={{ marginBottom: 10 }}>
          {/* <input type="text" className="bp3-input" placeholder="Номер договора" onChange={(e) => this.setState({ contract_number: e.target.value })} value={contract_number} disabled={busy} />
           */}
          <MaskedInput
            type="text"
            className="bp3-input"
            placeholder="Номер договора"
            onChange={(e) => this.setState({ contract_number: e.target.value })}
            value={contract_number}
            disabled={busy}
            guide={false}
            mask={[
              "M",
              "T",
              "X",
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/
            ]}
          />
        </div>

        <Button
          fill
          disabled={busy}
          outlined={_.isEmpty(contract)}
          icon={_.isEmpty(contract) ? "document" : "tick"}
          onClick={() => this._inputRef.current.click()}
          intent={_.isEmpty(contract) ? "none" : "success"}
          style={{ marginBottom: 10 }}>
          {_.isEmpty(contract) ? "Договор" : contract}
        </Button>

        <Button fill disabled={busy || _.isEmpty(company_name) || _.isEmpty(inn) || contract_number.length < 10 || _.isEmpty(contract)} onClick={this._send}>
          {busy ? <ClipLoader color="#fff" size={18} /> : "Отправить"}
        </Button>

        <input ref={this._inputRef} type="file" onChange={(ev) => this.setState({ contract: ev.target.files[0].name })} hidden />
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      activate_number: (form_data: FormData) => dispatch(activate_number_api(form_data))
    }
  };
}

export default connect(null, mapDispatchToProps)(AcceptNumber);
