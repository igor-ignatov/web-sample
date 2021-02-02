import React, { useState, useEffect } from "react";

import ClipLoader from "react-spinners/ClipLoader";
import { Divider, Card, Elevation, Button, EditableText, Intent } from "@blueprintjs/core";

import AcceptNumber from "../AcceptNumber";
import AccessLog from "./AccessLog";
import ServicesList from "./ServicesList";
import DetailGroup from "./DetailSelect";

import { connect } from "react-redux";
import _ from "lodash";

import { edit_customer_api } from "./operations";

import type { IRootState } from "../../redux/types";
import { ISession } from "../../common/types/session";

const NumberView: React.FC<{ store: IRootState; session: ISession; actions: any }> = ({ store, session, actions }) => {
  const { selected_number, fetch_info } = store.number_view_reducer;
  const [company_name, setName] = useState<string>("");
  const [inn, setInn] = useState<string>("");
  const [contract_number, set_contract_number] = useState<string>("");
  const [need_update, set_need_update] = useState<boolean>(false);
  const [busy, set_busy] = useState<boolean>(false);

  useEffect(() => {
    if (!_.isEmpty(selected_number)) {
      setName(decodeURIComponent(selected_number.customer.name));
      setInn(decodeURIComponent(selected_number.customer.inn));
      set_contract_number(decodeURIComponent(selected_number.customer.contract_number));
    }
  }, [selected_number]);

  const check_need_update = () => {
    if (company_name !== selected_number.customer.name || inn !== selected_number.customer.inn || contract_number !== selected_number.customer.contract_number) {
      set_need_update(true);
    } else {
      if (need_update) {
        set_need_update(false);
      }
    }
  };

  const params_arr = _.toPairs(selected_number);
  const isTested: boolean = selected_number && ["79399006445", "79399006446", "79399006447", "79399006448", "79399006449"].includes(selected_number.number);

  const accepted = ["god", "admin"].includes(session.user.role);

  return fetch_info || _.isEmpty(selected_number) ? (
    <div className="d-flex justify-content-center align-items-center" style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
      <ClipLoader color="#ff7700" />
    </div>
  ) : (
    <>
      <div className="row my-3 justify-content-start align-items-start number-info-container">
        <div className="col-auto">
          <div className="row no-gutters">
            {selected_number && (
              <div className="col-auto">
                <Card interactive={false} elevation={Elevation.ONE} style={{ paddingTop: 10 }}>
                  {_.isEmpty(selected_number.customer) ? (
                    <>{accepted && <AcceptNumber number={selected_number} />}</>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>Customer info</h5>
                        {need_update && (
                          <Button
                            icon="updated"
                            intent={Intent.PRIMARY}
                            small
                            loading={busy}
                            disabled={busy}
                            onClick={async () => {
                              set_busy(true);
                              await actions.edit_customer({ company_name, inn, contract_number }).catch((err) => console.log("!!! Error while update: ", err));
                              set_busy(false);
                              set_need_update(false);
                            }}
                          />
                        )}
                      </div>
                      <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small" style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td>
                              <p>ID</p>
                            </td>
                            <td>
                              <p>{decodeURIComponent(selected_number.customer.id)}</p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p>Name</p>
                            </td>
                            <td>
                              <EditableText maxLines={1} value={company_name} onChange={(val) => setName(val)} onConfirm={() => check_need_update()} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p>INN</p>
                            </td>
                            <td>
                              <EditableText maxLines={1} value={inn} onChange={(val) => setInn(val)} onConfirm={() => check_need_update()} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <p>Contract number</p>
                            </td>
                            <td>
                              <EditableText maxLines={1} value={contract_number} onChange={(val) => set_contract_number(val)} onConfirm={() => check_need_update()} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {isTested && (
                        <>
                          <Divider style={{ marginTop: 15 }} />
                          <AcceptNumber number={selected_number} />
                        </>
                      )}
                    </>
                  )}
                  <Divider style={{ marginTop: 15 }} />
                  <h5>Number info</h5>
                  <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small" style={{ marginBottom: 15 }}>
                    <tbody>
                      {params_arr.map(
                        (item) =>
                          _.isString(item[1]) && (
                            <tr key={item[0]}>
                              <td>
                                <p>{item[0]}</p>
                              </td>
                              <td>
                                <p>{item[1]}</p>
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                  <Divider style={{ marginTop: 15 }} />
                  <h5>Остатки по пакетам</h5>
                  <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small" style={{ marginBottom: 15 }}>
                    <tbody>
                      {selected_number.agr.map((ag) => (
                        <tr key={ag.name}>
                          <td style={{ fontSize: 11 }}>
                            {ag.name}: {ag.val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="row no-gutters justify-content-between align-items-center">
                    <div className="col-auto">
                      <DetailGroup busy={!selected_number} number={selected_number.number} />
                    </div>
                    {session.user.role === "god" && (
                      <div className="col-auto">
                        <Button
                          icon="settings"
                          small
                          onClick={() => {
                            if (window) window.open(`https://ecount.mtxi.ru/pls/b/wi$oper.srch_sc?i_e164=${selected_number.number}`);
                          }}>
                          Биллинг
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
        <div className="col">
          <div className="row no-gutters">
            <div className="col-auto mb-3">
              <ServicesList selected_number={selected_number} accepted={accepted} />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-auto">
              <AccessLog logs={selected_number.request_history} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    store: {
      number_view_reducer: state.number_view_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      edit_customer: (upd_data) => dispatch(edit_customer_api(upd_data))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NumberView);
