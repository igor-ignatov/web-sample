import React from "react";

import Router from "next/router";
import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Cell, Column, Table, TableLoadingOption, RenderMode, CopyCellsMenuItem, IMenuContext, ColumnHeaderCell } from "@blueprintjs/table";

import { connect } from "react-redux";
import { get_numbers_list_api } from "../operations";

import type { Props, State } from "./types";

const cell_style = { display: "flex", justifyContent: "flex-start", alignItems: "center" };

class NumbersTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      indexes: ["b", "number", "contract_number", "client", "tariff", "activation_date", "start_date", "end_date", "status", "balance"]
    };
  }

  protected renderBodyContextMenu = (context: IMenuContext) => {
    const { indexes } = this.state;
    const { list } = this.props;

    return (
      <Menu>
        <CopyCellsMenuItem
          context={context}
          getCellData={(row: number, column: number) => {
            return list[row][indexes[column]] || "";
          }}
          icon="duplicate"
          text="Скопировать"
        />
      </Menu>
    );
  };

  protected renderMenu = (key: string) => {
    const { actions, store } = this.props;
    const { page } = store.number_list_reducer;

    return (
      <Menu>
        <MenuItem icon="sort-asc" onClick={() => actions.get_numbers_list(page, { sort: { key, direction: "asc" }})} text="Sort Asc" />
        <MenuItem icon="sort-desc" onClick={() => actions.get_numbers_list(page, { sort: { key, direction: "desc" }})} text="Sort Desc" />
      </Menu>
    );
  };

  private columnHeaderCellRenderer = (name: string, key: string) => {
    const { enableSorting } = this.props;

    return <ColumnHeaderCell name={name} menuRenderer={() => (enableSorting ? this.renderMenu(key) : null)} />;
  };

  render() {
    const { busy, onPage, list, store } = this.props;
    const { user_data, theme } = store.global_site_reducer;
    const columns_widths = user_data && user_data.role === "god" ? [35, null, null, null, null, null, null, null, null, null, null] : [35, null, null, null, null, null, null, null, null, null];

    const status_colors = {
      "active": "#398A2E",
      "system block": "#D11515",
      "user block": "#D11587",
      "pre-activate": "#1582D1",
      "not inited": "#aaa"
    };

    return (
      <Table
        defaultRowHeight={24}
        renderMode={RenderMode.NONE}
        loadingOptions={[TableLoadingOption.CELLS]}
        numRows={busy ? onPage : list.length}
        columnWidths={columns_widths}
        bodyContextMenuRenderer={this.renderBodyContextMenu}
        onCopy={(e) => console.log("onCopy", e)}>
        <Column
          name=""
          cellRenderer={(rowIndex: number) => (
            <Cell tooltip={list[rowIndex] ? `Просмотр ${list[rowIndex].number}` : ""} style={{ padding: 0 }} loading={false}>
              <Button
                onClick={() => {
                  Router.push(`/${list[rowIndex].number}`);
                }}
                disabled={busy}
                minimal
                fill
                small
                icon="eye-open"
              />
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Номер", "number")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].number : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Номер договора", "contract_number")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].contract_number : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Клиент", "client")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].client : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Тариф", "tariff")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].tariff : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Дата активации", "activation_date")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].activation_date : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Start date", "start_date")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].start_date : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("End date", "end_date")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].end_date : ""}
            </Cell>
          )}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Статус", "status")}
          cellRenderer={(rowIndex: number) => {
            const status = list[rowIndex] ? list[rowIndex].status : "";

            return (
              <Cell style={{ ...cell_style, borderWidth: status_colors[status] ? "0 0 0 5px" : 0, borderStyle: "solid", borderColor: status_colors[status] || "transparent" }} loading={busy}>
                {status}
              </Cell>
            );
          }}
        />
        <Column
          columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Баланс", "balance")}
          cellRenderer={(rowIndex: number) => (
            <Cell style={cell_style} loading={busy}>
              {list[rowIndex] ? list[rowIndex].balance : ""}
            </Cell>
          )}
        />
        {user_data && user_data.role === "god" && (
          <Column
            columnHeaderCellRenderer={() => this.columnHeaderCellRenderer("Дилер", "dlr_id")}
            cellRenderer={(rowIndex: number) => (
              <Cell style={cell_style} loading={busy}>
                {list[rowIndex] ? (
                  <>
                    {["1121", "978", "0"].includes(list[rowIndex].dlr_id) ? (
                      <>
                        {list[rowIndex].dlr_id === "1121" && "UIS"}
                        {list[rowIndex].dlr_id === "978" && "Omicron"}
                        {list[rowIndex].dlr_id === "0" && "MTX"}
                      </>
                    ) : (
                      list[rowIndex].dlr_id
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
    );
  }
}

function mapStateToProps(state) {
  return {
    store: {
      number_list_reducer: state.number_list_reducer,
      global_site_reducer: state.global_site_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      get_numbers_list: (page, options) => dispatch(get_numbers_list_api(page, options))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NumbersTable);
