import React, { useState } from "react";

import { InputGroup, Popover, Menu, MenuItem, Button, Position } from "@blueprintjs/core";
import MaskedInput from "react-text-mask";

import { connect } from "react-redux";
import { search_number_api, search_number_by_string_api, set_search_string_api, set_search_mode_api } from "./operations";
import { get_numbers_list_api } from "../NumbersList/operations";

import type { Props } from "./types";
import { IRootState } from "../../redux/types";

const SearchNumbers: React.FC<Props> = ({ actions, store }) => {
  const [busy, set_busy] = useState<boolean>(false);

  const { search_string, mode } = store.search_number_reducer;

  const search = async () => {
    if (search_string.length === 0) {
      set_busy(true);
      await actions.get_numbers_list();
      set_busy(false);
    } else {
      set_busy(true);
      if (mode === "pattern") {
        await actions.search_number(search_string);
      }

      if (mode === "client") {
        await actions.search_number_by_string(search_string);
      }
      set_busy(false);
    }
  };

  const change_mode = (mode: string) => {
    actions.set_search_mode(mode);
    actions.set_search_string(mode === "pattern" ? "7" : "");
  };

  const permissionsMenu = (
    <Popover
      content={
        <Menu onChange={(e) => console.log(e)}>
          <MenuItem active={mode === "pattern"} text="pattern" onClick={() => change_mode("pattern")} />
          <MenuItem active={mode === "client"} text="client" onClick={() => change_mode("client")} />
        </Menu>
      }
      disabled={busy}
      position={Position.BOTTOM_RIGHT}>
      <Button disabled={busy} minimal={true} rightIcon="caret-down">
        {mode}
      </Button>
    </Popover>
  );

  return (
    <div className="row no-gutters" style={{ width: 300 }}>
      <div className="col-12">
        {mode === "pattern" && (
          <div className="bp3-input-group">
            <MaskedInput
              value={search_string}
              disabled={busy}
              onChange={(e) => actions.set_search_string(e.target.value)}
              placeholder="+7 (XXX) XXX-XX-XX"
              guide={false}
              className="bp3-input"
              type="tel"
              mask={["+", /7/, " ", "(", /[0-9]/, /[0-9]/, /[0-9]/, ")", " ", /[0-9]/, /[0-9]/, /[0-9]/, "-", /[0-9]/, /[0-9]/, "-", /[0-9]/, /[0-9]/]}
              onKeyPress={async (e) => {
                if (e.key === "Enter") {
                  search();
                }
              }}
              style={{ fontWeight: 500 }}
            />
            <div className="bp3-input-action">
              {permissionsMenu}
              <Button
                disabled={search_string.replace(/[^a-zA-Z0-9А-Яа-я]/g, "").length === 0 || busy}
                minimal={true}
                loading={busy}
                icon="search"
                onClick={async () => {
                  search();
                }}
              />
              <Button
                disabled={busy}
                minimal={true}
                icon="cross"
                onClick={async () => {
                  actions.set_search_string("7");

                  set_busy(true);
                  await actions.get_numbers_list();
                  set_busy(false);
                }}
              />
            </div>
          </div>
        )}
        {mode === "client" && (
          <InputGroup
            disabled={busy}
            placeholder="client name"
            onChange={(e) => actions.set_search_string(e.target.value)}
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
            rightElement={
              <>
                {permissionsMenu}
                <Button
                  disabled={busy}
                  minimal={true}
                  loading={busy}
                  icon="search"
                  onClick={async () => {
                    search();
                  }}
                />
                <Button
                  disabled={busy}
                  minimal={true}
                  icon="cross"
                  onClick={async () => {
                    actions.set_search_string("");

                    set_busy(true);
                    await actions.get_numbers_list();
                    set_busy(false);
                  }}
                />
              </>
            }
          />
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state: IRootState) {
  return {
    store: {
      search_number_reducer: state.search_number_reducer,
      global_site_reducer: state.global_site_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      search_number: (number) => dispatch(search_number_api(number)),
      get_numbers_list: () => dispatch(get_numbers_list_api()),
      search_number_by_string: (str) => dispatch(search_number_by_string_api(str)),
      set_search_string: (str) => dispatch(set_search_string_api(str)),
      set_search_mode: (mode) => dispatch(set_search_mode_api(mode))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchNumbers);
