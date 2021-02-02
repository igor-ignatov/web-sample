import React from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import { connect } from "react-redux";
import _ from "lodash";

import { toggle_numbers_filter_api, get_numbers_list_api } from "../../operations";

import type { IRootState } from "../../../../redux/types";

const DealerSelect = Select.ofType<{ id: string; name: string }>();

const filterDealers: ItemPredicate<{ id: string; name: string }> = (query, dealer) => {
  return dealer.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderDealer: ItemRenderer<{ id: string; name: string }> = (dealer, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return <MenuItem active={modifiers.active} key={dealer.id} onClick={handleClick} text={dealer.name || "all"} />;
};

const SelectDealer: React.FC<{ store: IRootState; actions: any }> = ({ store, actions }) => {
  const { busy, filters, dealers } = store.number_list_reducer;
  const { theme } = store.global_site_reducer;

  const all_dealers: Array<{ id: string; name: string }> = _.concat([{ id: "", name: "" }], dealers);
  const is_filter_exists = _.find(filters, { key: "dlr_id" });
  const selected_dealer = is_filter_exists ? is_filter_exists.value : "";
  const active = _.find(dealers, (s) => s.id === selected_dealer);

  const dealer_selected = (dlr: string) => {
    const { page } = store.number_list_reducer;

    actions.toggle_numbers_filter({ key: "dlr_id", value: dlr });

    setTimeout(() => {
      actions.get_numbers_list(page);
    });
  };

  return (
    <DealerSelect
      className={theme}
      filterable={false}
      activeItem={active}
      itemPredicate={filterDealers}
      itemRenderer={renderDealer}
      items={all_dealers}
      onItemSelect={(item) => dealer_selected(item.id)}>
      <Button icon="shop" rightIcon="chevron-down" text={active ? active.name : "-- dealer --"} disabled={busy} />
    </DealerSelect>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectDealer);
