import React from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import { connect } from "react-redux";
import _ from "lodash";

import { toggle_activations_filter_api, get_activations_api } from "../../operations";

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

const SelectDealer: React.FC<{ store: IRootState; actions: any; sdat: any; edat: any }> = ({ store, actions, sdat, edat }) => {
  const dealers = [
    { id: "0", name: "MTX" },
    { id: "1121", name: "UIS" },
    { id: "978", name: "Omicron" }
  ];
  const { filters, isFetching, page } = store.activations_reducer;
  const { theme } = store.global_site_reducer;

  const all_dealers: Array<{ id: string; name: string }> = _.concat([{ id: "", name: "" }], dealers);
  const is_filter_exists = _.find(filters, { key: "dlr_id" });
  const selected_dealer = is_filter_exists ? is_filter_exists.value : "";
  const active = _.find(dealers, (s) => s.id === selected_dealer);

  const dealer_selected = (dlr: string) => {
    actions.toggle_activations_filter({ key: "dlr_id", value: dlr });

    setTimeout(() => {
      const edatcloned = _.cloneDeep(edat);

      actions.get_activations(page, sdat.format("DD.MM.YYYY"), edatcloned.add(1, "days").format("DD.MM.YYYY"));
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
      <Button icon="shop" rightIcon="chevron-down" text={active ? active.name : "-- dealer --"} disabled={isFetching} />
    </DealerSelect>
  );
};

function mapStateToProps(state) {
  return {
    store: {
      activations_reducer: state.activations_reducer,
      number_list_reducer: state.number_list_reducer,
      global_site_reducer: state.global_site_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      toggle_activations_filter: (filter) => dispatch(toggle_activations_filter_api(filter)),
      get_activations: (page: number, sdat: string, edat: string) => dispatch(get_activations_api(page, sdat, edat))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectDealer);
