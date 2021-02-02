import React from "react";

import Router from "next/router";
import { Button, Card, ButtonGroup } from "@blueprintjs/core";
import { parse } from "json2csv";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import _ from "lodash";

import type { IRootState } from "../../redux/types";
import type { Props, State } from "./types";

class Deatil extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      periods: [
        { name: "3 дня", value: "3days" },
        { name: "Прошлая неделя", value: "last_week" },
        { name: "Эта неделя", value: "week" },
        { name: "Прошлый месяц", value: "last_month" },
        { name: "Этот месяц", value: "month" }
      ]
    };
  }

  render() {
    const { periods } = this.state;
    const { store, current_period, number } = this.props;
    const { detail, isFetching, error } = store.detail_reducer;

    return (
      <div className="row no-gutters">
        <div className="col-12 py-3">
          <ButtonGroup>
            {periods.map((period) => (
              <Button
                key={period.value}
                disabled={isFetching || period.value === current_period}
                intent="primary"
                onClick={() => Router.push(`/${number}/detail/${period.value}`)}>
                {period.name}
              </Button>
            ))}
            <Button
              icon="download"
              intent="primary"
              disabled={isFetching || _.isEmpty(detail.traffic)}
              onClick={() => {
                const parse_opts = { encoding: "utf8", delimiter: ";", withBOM: true };
                const csv = parse(detail.traffic, parse_opts);

                const element = document.createElement("a");
                element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
                element.setAttribute("download", `detail_${number}_${current_period}.csv`);

                element.style.display = "none";
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
              }}>
              Скачать
            </Button>
          </ButtonGroup>
        </div>

        {isFetching && (
          <div className="d-flex justify-content-center align-items-center" style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
            <ClipLoader color="#ff7700" />
          </div>
        )}

        {error && (
          <div className="col-12 d-flex justify-content-center align-items-center">
            <div className="alert alert-danger" role="alert" style={{ fontSize: 15 }}>
              Произошла ошибка
            </div>
          </div>
        )}

        <div className="col-auto">
          {detail.traffic && detail.traffic.length > 0 ? (
            <Card>
              <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small" style={{ fontSize: 11 }}>
                <thead>
                  <tr>
                    {_.keys(detail.traffic[0]).map((dkey) => {
                      return (
                        dkey !== "id" && (
                          <th key={dkey} style={{ border: 0 }}>
                            {dkey}
                          </th>
                        )
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {detail.traffic.map((item) => {
                    return (
                      <tr key={item.id}>
                        {_.toPairs(item).map((val) => {
                          return (
                            val[0] !== "id" && (
                              <td key={`row_det_${val[0]}${item.id}`} style={_.isNaN(Number(val[1])) ? { textAlign: "left" } : { textAlign: "right" }}>
                                {val[1]}
                              </td>
                            )
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          ) : (
            <div className="col-12 d-flex justify-content-center align-items-center">
              {detail.traffic && !isFetching && (
                <div className="alert alert-info" role="alert" style={{ fontSize: 15 }}>
                  Нет данных за период
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IRootState) {
  return {
    store: {
      detail_reducer: state.detail_reducer
    }
  };
}

export default connect(mapStateToProps)(Deatil);
