import React from "react";

import { connect } from "react-redux";
import { upload_contract_api } from "./operations";

import type { Props, State } from "./types";

class UploadContract extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      busy: false,
      result: {}
    };
  }

  __fileinput_ref = React.createRef<HTMLInputElement>();

  __parse_data = (file: File) => {
    const { actions } = this.props;

    this.setState({ busy: true, error: false }, () => {
      const form_data = new FormData();
      form_data.append("contract", file);

      actions
        .upload_contract(form_data)
        .then((result) => {
          this.setState({ result, busy: false });
        })
        .catch((err) => {
          console.log("error", err);
          this.setState({ busy: false, error: true });
        });
    });
  };

  render() {
    const { error, busy, result } = this.state;

    console.log("result", result);

    return (
      <div className="row no-gutters">
        <div className="col-12 py-3">
          {error && (
            <div className="alert alert-danger" role="alert" style={{ fontSize: 14 }}>
              Произошла ошибка
            </div>
          )}
          <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={() => this.__fileinput_ref.current.click()}>
            Загрузить PDF
          </button>
          <input
            ref={this.__fileinput_ref}
            type="file"
            disabled={busy}
            onChange={(e) => {
              this.__parse_data(e.target.files[0]);
            }}
            hidden
          />
        </div>

        <div className="col-12">
          {result && (
            <>
              <table className="table table-sm" style={{ width: 500 }}>
                <tbody>
                  <tr>
                    <td>Компания: </td>
                    <td>{result.customer.name}</td>
                  </tr>
                  <tr>
                    <td>ИНН: </td>
                    <td>{result.customer.inn}</td>
                  </tr>
                  <tr>
                    <td>Номер договора: </td>
                    <td>{result.customer.contract_number}</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>msisdn</th>
                    <th>icc</th>
                    <th>доп сервисы</th>
                    <th>абонентская плата</th>
                  </tr>
                </thead>
                <tbody>
                  {result.numbers.map((item) => {
                    return (
                      <tr key={`tri_${item.n}`}>
                        <td>{item.n}</td>
                        <td>{item.msisdn}</td>
                        <td>{item.icc}</td>
                        <td>{item.additional_service}</td>
                        <td>{item.abon_pay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      upload_contract: (form_data) => dispatch(upload_contract_api(form_data))
    }
  };
}

export default connect(null, mapDispatchToProps)(UploadContract);
