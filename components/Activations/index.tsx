import React from "react";

import Router from "next/router";
import { Button, NonIdealState, Menu, MenuItem } from "@blueprintjs/core";
import { Cell, Column, Table, TableLoadingOption, RenderMode, SelectionModes, ColumnHeaderCell } from "@blueprintjs/table";
import { DateRangeInput } from "@blueprintjs/datetime";
import SelectDealer from "./Selects/Dealer";
import SelectTariff from "./Selects/Tariffs";

import { connect } from "react-redux";
import moment from "moment";
import { parse } from "json2csv";
import _ from "lodash";

import { get_activations_api, set_activations_list_api, set_activations_page_api } from "./operations";

import type { Props, State } from "./types";
import type { IRootState } from "../../redux/types";
import type { IActivation } from "../../common/types/activations";

const cell_style = { display: "flex", justifyContent: "flex-start", alignItems: "center" };

class Activations extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      sdat: null,
      edat: null,
      total: 0,
      lp: 0,
      pages: [],
      error_contracts: [],
      error_names: []
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { activations, onPage } = props.store.activations_reducer;

    if (activations.l !== state.total) {
      const pages = [];

      for (let i = 0; i < Math.ceil(activations.l / onPage); i++) {
        pages.push(i + 1);
      }

      const error_contracts = activations.data.map((act, a) => {
        if (!act.contract.toLowerCase().startsWith("mtx")) {
          return a;
        }

        return null;
      }).filter(f => f);

      const error_names = activations.data.map((act, a) => {
        if (new RegExp("[A-Za-z]", "g").test(act.client)) {
          return a;
        }

        return null;
      }).filter(f => f);

      return { pages, total: activations.l, error_contracts, error_names };
    }

    return null;
  }

  componentDidMount() {
    const { actions } = this.props;

    const sdat_saved = window.sessionStorage.getItem("@mtx:act_sdat");
    const edat_saved = window.sessionStorage.getItem("@mtx:act_edat");

    if (sdat_saved && edat_saved) {
      const sdat = moment(Number(sdat_saved));
      const edat = moment(Number(edat_saved));
      const edatcloned = _.cloneDeep(edat);

      this.setState({ sdat, edat }, () => {
        actions.get_activations(1, sdat.format("DD.MM.YYYY"), edatcloned.add(1, "days").format("DD.MM.YYYY"));
      });
    } else {
      const sdat = moment().add(-1, "days");
      const edat = moment();
      const edatcloned = _.cloneDeep(edat);

      this.setState({ sdat, edat }, () => {
        actions.get_activations(1, sdat.format("DD.MM.YYYY"), edatcloned.add(1, "days").format("DD.MM.YYYY"));
      });
    }
  }

  private get_activations = (page: number): void => {
    const { actions } = this.props;
    const { sdat, edat } = this.state;

    window.sessionStorage.setItem("@mtx:act_sdat", String(Math.floor(sdat.toDate())));
    window.sessionStorage.setItem("@mtx:act_edat", String(Math.floor(edat.toDate())));

    const edatcloned = _.cloneDeep(edat);
    actions.get_activations(page, sdat.format("DD.MM.YYYY"), edatcloned.add(1, "days").format("DD.MM.YYYY"));
  };

  private sorting = (key: string, dir: "desc" | "asc"): IActivation[] => {
    const { activations } = this.props.store.activations_reducer;

    const sorted = _.orderBy(
      activations.data,
      (a) => {
        if (key === "contract_number") {
          const prep = a[key].replace(/\D/g, "").trim();

          if (_.isEmpty(prep)) {
            return 0;
          }

          return Number(prep);
        }

        if (key.includes("date")) {
          if (_.isEmpty(a[key])) {
            return 0;
          }

          return moment(a[key], "DD.MM.YY kk:mm:ss").toDate();
        }

        if (key === "number") {
          return Number(a[key]);
        }

        if (key === "client") {
          if (_.isEmpty(a[key])) {
            return 0;
          }

          return a[key];
        }

        return a[key];
      },
      dir
    );

    return sorted;
  };

  private renderMenu = (key: string): React.ReactElement => {
    const { actions, store } = this.props;
    const { activations } = store.activations_reducer;

    return (
      <Menu>
        <MenuItem
          icon="sort-asc"
          onClick={() => {
            const new_list = this.sorting(key, "asc");

            actions.set_activations_list({ data: new_list, l: activations.l });
          }}
          text="Sort Asc"
        />
        <MenuItem
          icon="sort-desc"
          onClick={() => {
            const new_list = this.sorting(key, "desc");

            actions.set_activations_list({ data: new_list, l: activations.l });
          }}
          text="Sort Desc"
        />
      </Menu>
    );
  };

  private render_pagination = () => {
    const { pages, lp } = this.state;
    const { store, actions } = this.props;
    const { page, isFetching } = store.activations_reducer;

    return (
      <div className="col-auto my-2">
        <div className="row no-gutters justify-content-end align-items-center numbers-list-container-pagination-container">
          {pages.length > 0 &&
            pages.map((p) => (
              <div className="col-auto ml-1" key={p}>
                <Button
                  loading={lp === p && isFetching}
                  small
                  className={`btn ${page === p ? "btn-light" : "btn-outline-dark"} btn-sm`}
                  disabled={page === p || isFetching}
                  onClick={() => {
                    this.setState({ lp: p }, () => {
                      actions.set_activations_page(p);
                    });
                  }}>
                  {p}
                </Button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  private columnHeaderCellRenderer = (name: string, key: string) => <ColumnHeaderCell name={name} menuRenderer={() => this.renderMenu(key)} />;

  render() {
    const { sdat, edat, error_contracts, error_names } = this.state;
    const { store } = this.props;
    const { user_data, theme } = store.global_site_reducer;
    const { isFetching, activations, error, page, onPage } = store.activations_reducer;
    const columns_widths = user_data && user_data.role === "god" ? [35, null, null, null, null, null, null, null] : [35, null, null, null, null, null, null];
    const start: number = onPage * page - onPage;
    const end: number = onPage * page;
    const paged: IActivation[] = activations.data.slice(start, end);
    const error_color = theme === "bp3-dark" ? "#6a0d0d" : "#fdbcb4";

    return (
      <div className="row no-gutters">
        <div className="col-12 py-2">
          <div className="row no-gutters">
            <div className="col-auto d-flex justify-content-center align-items-center pr-3">
              <h5 style={{ fontSize: 14, fontWeight: 400, margin: 0, lineHeight: 1 }}>Активации за период ({activations.l}):</h5>
            </div>
            <div className="col-auto d-flex justify-content-center align-items-center">
              <div className="bp3-input-group">
                <DateRangeInput
                  formatDate={(date) => moment(date).format("DD.MM.YYYY")}
                  onChange={(e) => {
                    this.setState({ sdat: e[0] ? moment(e[0]) : sdat, edat: e[1] ? moment(e[1]) : edat });
                  }}
                  parseDate={(str) => new Date(str)}
                  value={[sdat ? sdat.toDate() : null, edat ? edat.toDate() : null]}
                  allowSingleDayRange
                />
                <Button loading={isFetching} disabled={isFetching} icon="search" intent="primary" onClick={() => this.get_activations(page)} />
              </div>
            </div>
            {user_data && user_data.role === "god" && (
              <div className="col-auto d-flex justify-content-center align-items-center ml-3">
                <SelectDealer sdat={sdat} edat={edat} />
              </div>
            )}
            {user_data && user_data.role === "god" && (
              <div className="col-auto d-flex justify-content-center align-items-center ml-3">
                <SelectTariff sdat={sdat} edat={edat} />
              </div>
            )}
            <div className="col-auto d-flex justify-content-center align-items-center ml-3">
              <Button
                disabled={isFetching}
                intent="primary"
                icon="download"
                onClick={() => {
                  const parse_opts = { encoding: "utf8", delimiter: ";", withBOM: true };
                  const csv = parse(activations.data, parse_opts);

                  const element = document.createElement("a");
                  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
                  element.setAttribute("download", "activation.csv");

                  element.style.display = "none";
                  document.body.appendChild(element);

                  element.click();

                  document.body.removeChild(element);
                }}>
                Скачать
              </Button>
            </div>
            <div className="col">{this.render_pagination()}</div>
          </div>
        </div>

        <div className="col-12">
          {error && (
            <div className="alert alert-danger d-flex justify-content-center align-items-center mt-3" role="alert" style={{ fontSize: 15 }}>
              Произошла ошибка
            </div>
          )}
          {paged.length === 0 && !isFetching && <NonIdealState icon="search" title="Ничего не найдено" />}
          {paged.length > 0 && (
            <Table
              selectionModes={SelectionModes.ROWS_AND_CELLS}
              defaultRowHeight={24}
              renderMode={RenderMode.NONE}
              loadingOptions={[TableLoadingOption.CELLS]}
              numRows={paged.length}
              rowHeaderCellRenderer={(rowIndex) => <ColumnHeaderCell style={{ textAlign: "center", width: 40, fontWeight: 12 }} name={(start + rowIndex + 1).toString()} />}
              columnWidths={columns_widths}>
              <Column
                name=""
                cellRenderer={(rowIndex: number) => {
                  return (
                    <Cell tooltip={paged[rowIndex] ? `Просмотр ${paged[rowIndex].number}` : ""} style={{ padding: 0 }} loading={false}>
                      <Button
                        onClick={() => {
                          Router.push(`/${paged[rowIndex].number}`);
                        }}
                        disabled={isFetching}
                        minimal
                        fill
                        small
                        icon="eye-open"
                      />
                    </Cell>
                  );
                }}
              />
              <Column
                columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Номер", "number")}
                cellRenderer={(rowIndex: number) => (
                  <Cell style={cell_style} loading={isFetching}>
                    {paged[rowIndex] ? paged[rowIndex].number : ""}
                  </Cell>
                )}
              />
              <Column
                columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Клиент", "client")}
                cellRenderer={(rowIndex: number) => (
                  <Cell style={{ ...cell_style, backgroundColor: error_names.includes(rowIndex) ? error_color : "transparent" }} loading={isFetching}>
                    {paged[rowIndex] ? paged[rowIndex].client : ""}
                  </Cell>
                )}
              />
              <Column
                columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Договор", "contract")}
                cellRenderer={(rowIndex: number) => {
                  return (
                    <Cell style={{ ...cell_style, backgroundColor: error_contracts.includes(rowIndex) ? error_color : "transparent" }} loading={isFetching}>
                      {paged[rowIndex] ? paged[rowIndex].contract : ""}
                    </Cell>
                  );
                }}
              />
              <Column
                columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Тариф", "tariff")}
                cellRenderer={(rowIndex: number) => (
                  <Cell style={cell_style} loading={isFetching}>
                    {paged[rowIndex] ? paged[rowIndex].tariff : ""}
                  </Cell>
                )}
              />
              <Column
                columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Start date", "start_date")}
                cellRenderer={(rowIndex: number) => (
                  <Cell style={cell_style} loading={isFetching}>
                    {paged[rowIndex] ? paged[rowIndex].start_date : ""}
                  </Cell>
                )}
              />
              <Column
                columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Пакеты", "pack_names")}
                cellRenderer={(rowIndex: number) => {
                  let pack_name;

                  if (paged[rowIndex].pack_names) {
                    const packs_arr = paged[rowIndex].pack_names.split(",");
                    const true_packs = [];

                    for (const pack of packs_arr) {
                      if (pack !== "FMC UISCOM") {
                        true_packs.push(pack.replace("FMC UISCOM", ""));
                      }
                    }

                    pack_name = true_packs.join(", ");
                  }

                  return (
                    <Cell style={cell_style} loading={isFetching}>
                      {pack_name}
                    </Cell>
                  );
                }}
              />
              {user_data && user_data.role === "god" && (
                <Column
                  columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Дилер", "dlr_id")}
                  cellRenderer={(rowIndex: number) => (
                    <Cell style={cell_style} loading={isFetching}>
                      {paged[rowIndex] ? (
                        <>
                          {["1121", "978", "0"].includes(paged[rowIndex].dlr_id) ? (
                            <>
                              {paged[rowIndex].dlr_id === "1121" && "UIS"}
                              {paged[rowIndex].dlr_id === "978" && "Omicron"}
                              {paged[rowIndex].dlr_id === "0" && "MTX"}
                            </>
                          ) : (
                            paged[rowIndex].dlr_id
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </Cell>
                  )}
                />
              )}
            </Table>
          )}
        </div>
        <div className="col-12">{this.render_pagination()}</div>
      </div>
    );
  }
}

function mapStateToProps(state: IRootState) {
  return {
    store: {
      activations_reducer: state.activations_reducer,
      global_site_reducer: state.global_site_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      get_activations: (page: number, sdat: string, edat: string) => dispatch(get_activations_api(page, sdat, edat)),
      set_activations_list: (list) => dispatch(set_activations_list_api(list)),
      set_activations_page: (page: number) => dispatch(set_activations_page_api(page))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Activations);
