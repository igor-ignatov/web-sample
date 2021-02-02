import React from "react";

import Link from "next/link";
import { Card, Elevation } from "@blueprintjs/core";
import NumbersTable from "../NumbersTable";

import { connect } from "react-redux";

import type { IRootState } from "../../../redux/types";

const GroupNumbersTable: React.FC<{ store: IRootState }> = ({ store }) => {
  const { list, busy } = store.number_list_reducer;

  const highlight = (text: string = "") => {
    const { search_string } = store.search_number_reducer;
    const prep_text = text.toLocaleLowerCase();

    const index = prep_text.indexOf(search_string);

    if (index >= 0) {
      return (
        <>
          {text.substring(0, index)}
          <b style={{ color: "#ff7700" }}>{text.substring(index, index + search_string.length)}</b>
          {text.substring(index + search_string.length)}
        </>
      );
    }

    return text;
  };

  return (
    <div className="row no-gutters">
      {list.map((item) => (
        <div className="col-12" key={item.group}>
          <Card elevation={Elevation.ZERO} style={{ paddingTop: 10, boxShadow: "none" }}>
            <h5 style={{ fontSize: 15, lineHeight: 2 }}>
              <Link href={`/customer/${encodeURIComponent(item.group)}`}>{highlight(item.group) || ""}</Link>
            </h5>
            {item.data && <NumbersTable busy={busy} onPage={item.data.length} list={item.data} />}
          </Card>
        </div>
      ))}
    </div>
  );
};

function mapStateToProps(state: IRootState) {
  return {
    store: {
      number_list_reducer: state.number_list_reducer,
      search_number_reducer: state.search_number_reducer
    }
  };
}

export default connect(mapStateToProps, null)(GroupNumbersTable);
