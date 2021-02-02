import React from "react";

import { Button, NonIdealState } from "@blueprintjs/core";
import ClipLoader from "react-spinners/ClipLoader";

import { connect } from "react-redux";

import SelectGroup from "./Selects/Group";
import SelectStatus from "./Selects/Statuses";
import SelectTariff from "./Selects/Tariffs";
import SelectDealer from "./Selects/Dealer";
import SearchNumbers from "../SearchNumbers";
import NumbersTable from "./NumbersTable";
import GroupNumbersTable from "./GroupNumbersTable";
import DownloadNumbers from "./DownloadNumbers";

import { get_numbers_list_api, set_sorting_state_api } from "./operations";

import type { Props, State } from "./types";

class NumbersList extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      pages: [],
      lp: 1
    };
  }

  componentDidMount() {
    const { store, actions } = this.props;

    actions.get_numbers_list(store.number_list_reducer.page);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { total, onPage } = props.store.number_list_reducer;

    if (total !== state.total) {
      const pages = [];

      for (let i = 0; i < Math.ceil(total / onPage); i++) {
        pages.push(i + 1);
      }

      return { pages, total };
    }

    return null;
  }

  private render_pagination = () => {
    const { pages, lp } = this.state;
    const { store, actions } = this.props;
    const { page, busy } = store.number_list_reducer;

    return (
      <div className="col-auto my-2">
        <div className="row no-gutters justify-content-end align-items-center numbers-list-container-pagination-container">
          {pages.length > 0 &&
            pages.map((p) => (
              <div className="col-auto ml-1" key={p}>
                <Button
                  loading={lp === p && busy}
                  small
                  className={`btn ${page === p ? "btn-light" : "btn-outline-dark"} btn-sm`}
                  disabled={page === p || busy}
                  onClick={() => {
                    this.setState({ lp: p }, () => {
                      actions.get_numbers_list(p);
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

  render() {
    const { store, actions } = this.props;
    const { user_data } = store.global_site_reducer;
    const { list, busy, onPage, sort, page, group } = store.number_list_reducer;

    return (
      <div className="row no-gutters numbers-list-container">
        <div className="col-12">
          <div className="row py-2 no-gutters">
            <div className="col-auto d-flex justify-content-start align-items-center mr-3">
              <SearchNumbers />
            </div>
            <div className="col-auto d-flex justify-content-start align-items-center  mr-3">
              <SelectStatus />
            </div>
            {user_data && user_data.role === "god" && (
              <div className="col-auto d-flex justify-content-start align-items-center  mr-3">
                <SelectTariff />
              </div>
            )}
            {user_data && user_data.role === "god" && (
              <div className="col-auto d-flex justify-content-start align-items-center  mr-3">
                <SelectDealer />
              </div>
            )}
            <div className={"col-auto mr-3 d-flex justify-content-start align-items-center"}>
              <SelectGroup />
            </div>
            <div className={`${sort ? "col-auto" : "col"} mr-3 d-flex justify-content-start align-items-center`}>
              <DownloadNumbers />
            </div>
            {sort && (
              <div className="col d-flex justify-content-start align-items-center">
                <Button
                  icon="cross"
                  onClick={() => {
                    actions.set_sorting_state(null);
                    setTimeout(() => {
                      actions.get_numbers_list(page);
                    });
                  }}>
                  Сортировка {sort.key} | {sort.direction}
                </Button>
              </div>
            )}
            {this.render_pagination()}
          </div>
        </div>
        <div className="col-12">
          {busy && (
            <div className="d-flex justify-content-center align-items-center" style={{ position: "absolute", top: 300, left: 0, right: 0 }}>
              <ClipLoader color="#ff7700" />
            </div>
          )}
          {list.length === 0 && !busy && <NonIdealState icon="search" title="Ничего не найдено" />}

          {list.length > 0 && <>{group ? <GroupNumbersTable /> : <NumbersTable enableSorting={true} busy={busy} onPage={busy ? onPage : list.length} list={list} />}</>}
        </div>
        {this.render_pagination()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: {
      global_site_reducer: state.global_site_reducer,
      number_list_reducer: state.number_list_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      set_sorting_state: (sort) => dispatch(set_sorting_state_api(sort)),
      get_numbers_list: (page: number) => dispatch(get_numbers_list_api(page))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NumbersList);
