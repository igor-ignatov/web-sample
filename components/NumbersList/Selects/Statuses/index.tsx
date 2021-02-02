import React from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import { connect } from "react-redux";
import _ from "lodash";

import { toggle_numbers_filter_api, get_numbers_list_api } from "../../operations";

import type { IRootState } from "../../../../redux/types";

const StatusSelect = Select.ofType<[string, number]>();

const filterStatuses: ItemPredicate<[string, number]> = (query, status) => {
  return status[0].toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderStatus: ItemRenderer<[string, number]> = (status, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return <MenuItem active={modifiers.active} key={status[0]} label={status[1].toString()} onClick={handleClick} text={status[0] || "all"} />;
};

const SelectStatus: React.FC<{ actions: any; store: IRootState }> = ({ actions, store }) => {
  const { busy, statuses, filters } = store.number_list_reducer;
  const { theme } = store.global_site_reducer;
  // @ts-ignore
  const cc: number = statuses.length > 0 ? statuses.reduce((s: any, v: any) => (typeof s === "number" ? s + v[1] : s[1] + v[1])) : 0;

  const all_statuses: Array<[string, number]> = _.concat([["", cc]], statuses);
  const is_filter_exists = _.find(filters, { key: "status" });
  const selected_status = is_filter_exists ? is_filter_exists.value : "";
  const active = _.find(all_statuses, (s) => s[0] === selected_status);

  const status_selected = (st: string) => {
    const { page } = store.number_list_reducer;

    actions.toggle_numbers_filter({ key: "status", value: st });

    setTimeout(() => {
      actions.get_numbers_list(page);
    });
  };

  return (
    <StatusSelect
      className={theme}
      filterable={false}
      activeItem={active}
      itemPredicate={filterStatuses}
      itemRenderer={renderStatus}
      items={all_statuses}
      onItemSelect={(item) => status_selected(item[0])}>
      <Button icon="left-join" rightIcon="chevron-down" text={active ? `${active[0] || "all"} (${active[1]})` : "unknown"} disabled={busy} />
    </StatusSelect>
  );
};

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
      toggle_numbers_filter: (filter) => dispatch(toggle_numbers_filter_api(filter)),
      get_numbers_list: (page) => dispatch(get_numbers_list_api(page))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectStatus);
