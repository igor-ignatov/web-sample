import React, { useState } from "react";

import { Button } from "@blueprintjs/core";

import { parse } from "json2csv";
import { connect } from "react-redux";

import { get_numbers_list_api } from "./operations";

import type { IApiResponse } from "./operations";
import type { IRootState } from "../../../redux/types";

const DownloadNumbers: React.FC<{ actions: any; store: IRootState }> = ({ actions, store }) => {
  const { busy: numbers_busy } = store.number_list_reducer;
  const [busy, setBusy] = useState<boolean>(false);

  return (
    <Button
      disabled={busy || numbers_busy}
      intent="primary"
      icon="download"
      onClick={() => {
        setBusy(true);

        actions.get_numbers_list().then((numbers_resp: IApiResponse) => {
          const parse_opts = { encoding: "utf8", delimiter: ";", withBOM: true };
          const csv = parse(numbers_resp.numbers, parse_opts);

          const element = document.createElement("a");
          element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
          element.setAttribute("download", "numbers.csv");

          element.style.display = "none";
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
          setBusy(false);
        }).catch(() => setBusy(false));
      }}>
      Скачать
    </Button>
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
      get_numbers_list: () => dispatch(get_numbers_list_api())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadNumbers);
