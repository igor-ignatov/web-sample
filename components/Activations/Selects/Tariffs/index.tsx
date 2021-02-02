import React from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import { connect } from "react-redux";
import _ from "lodash";

import { toggle_activations_filter_api, get_activations_api } from "../../operations";

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

const SelectTariff: React.FC<{ store: IRootState; actions: any, sdat: any, edat: any }> = ({ store, actions, sdat, edat }) => {
  const { isFetching, filters, page } = store.activations_reducer;
  const tariffs = ["UIScom FMC", "Omicron FMC"];
  const { theme } = store.global_site_reducer;

  const all_tariffs: Array<string> = _.concat([""], tariffs);
  const is_filter_exists = _.find(filters, { key: "tariff" });
  const selected_tariff = is_filter_exists ? is_filter_exists.value : "";
  const active = _.find(tariffs, (s) => s === selected_tariff);

  const tariff_selected = (tr: string) => {
    actions.toggle_activations_filter({ key: "tariff", value: tr });

    setTimeout(() => {
      const edatcloned = _.cloneDeep(edat);

      actions.get_activations(page, sdat.format("DD.MM.YYYY"), edatcloned.add(1, "days").format("DD.MM.YYYY"));
    });
  };

  return (
    <TariffSelect className={theme} filterable={false} activeItem={active} itemPredicate={filterTariffs} itemRenderer={renderTariff} items={all_tariffs} onItemSelect={(item) => tariff_selected(item)}>
      <Button icon="layout-auto" rightIcon="chevron-down" text={selected_tariff || "-- tariff --"} disabled={isFetching} />
    </TariffSelect>
  );
};

function mapStateToProps(state) {
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
      toggle_activations_filter: (filter) => dispatch(toggle_activations_filter_api(filter)),
      get_activations: (page: number, sdat: string, edat: string) => dispatch(get_activations_api(page, sdat, edat))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTariff);
