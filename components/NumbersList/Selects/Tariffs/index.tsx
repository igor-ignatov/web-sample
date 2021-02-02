import React from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import { connect } from "react-redux";
import _ from "lodash";

import { toggle_numbers_filter_api, get_numbers_list_api } from "../../operations";

import type { IRootState } from "../../../../redux/types";

const TariffSelect = Select.ofType<string>();

const filterTariffs: ItemPredicate<string> = (query, tariff) => {
  return tariff.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderTariff: ItemRenderer<string> = (tariff, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return <MenuItem active={modifiers.active} key={tariff} onClick={handleClick} text={tariff || "all"} />;
};

const SelectTariff: React.FC<{ store: IRootState; actions: any }> = ({ store, actions }) => {
  const { busy, filters, tariffs } = store.number_list_reducer;
  const { theme } = store.global_site_reducer;

  const all_tariffs: Array<string> = _.concat([""], tariffs);
  const is_filter_exists = _.find(filters, { key: "tariff" });
  const selected_tariff = is_filter_exists ? is_filter_exists.value : "";
  const active = _.find(tariffs, (s) => s === selected_tariff);

  const tariff_selected = (tr: string) => {
    const { page } = store.number_list_reducer;

    actions.toggle_numbers_filter({ key: "tariff", value: tr });

    setTimeout(() => {
      actions.get_numbers_list(page);
    });
  };

  return (
    <TariffSelect className={theme} filterable={false} activeItem={active} itemPredicate={filterTariffs} itemRenderer={renderTariff} items={all_tariffs} onItemSelect={(item) => tariff_selected(item)}>
      <Button icon="layout-auto" rightIcon="chevron-down" text={selected_tariff || "-- tariff --"} disabled={busy} />
    </TariffSelect>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectTariff);
