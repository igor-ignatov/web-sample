import React from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import { connect } from "react-redux";
import _ from "lodash";

import { set_number_group_api, get_numbers_list_api } from "../../operations";

import type { IRootState } from "../../../../redux/types";

const GroupSelect = Select.ofType<string>();

const filterStatuses: ItemPredicate<string> = (query, group) => {
  return group.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderStatus: ItemRenderer<string> = (group, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      active={modifiers.active}
      key={group}
      label={group ? "grouping" : ""}
      onClick={handleClick}
      text={group || "-- group --"}
    />
  );
};

const SelectGroup: React.FC<{store:IRootState, actions: any; }> = ({ actions, store }) => {
  const { busy, group } = store.number_list_reducer;
  const all_groups: string[] = ["", "client"];
  const active = _.find(all_groups, g => g === group);

  const group_selected = (gr: string) => {
    const { page } = store.number_list_reducer;

    actions.set_number_group(gr);

    setTimeout(() => {
      actions.get_numbers_list(page);
    });
  };

  return (
    <GroupSelect filterable={false} activeItem={active} itemPredicate={filterStatuses} itemRenderer={renderStatus} items={all_groups} onItemSelect={(item) => group_selected(item)} >
      <Button
        icon="group-objects"
        rightIcon="chevron-down"
        text={`${active || "-- group --"}`}
        disabled={busy}
      />
    </GroupSelect>
  );
};

function mapStateToProps(state) {
  return {
    store: {
      number_list_reducer: state.number_list_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      set_number_group: group => dispatch(set_number_group_api(group)),
      get_numbers_list: (page, options) => dispatch(get_numbers_list_api(page, options))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectGroup);
