import React from "react";

import NumbersTable from "../NumbersList/NumbersTable";
import { Card, Elevation } from "@blueprintjs/core";

import type { INumber, ICustomer } from "../../common/types/numbers";

const CustomerView: React.FC<{ customer_info: { numbers: INumber[]; client: ICustomer } }> = ({ customer_info }) => {
  const { numbers } = customer_info;

  return (
    <div className="row no-gutters">
      <div className="col-auto my-3">
        <Card interactive={false} elevation={Elevation.ONE} style={{ paddingTop: 10 }}>
          <h5>Customer info</h5>
          <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small" style={{ width: "100%" }}>
            <tbody>
              {Object.entries(customer_info.client).map((item: [string, string]) => (
                <tr key={item[0]}>
                  <td>
                    <p style={{ fontSize: 11, lineHeight: 1.2, margin: 0 }}>{decodeURIComponent(item[0])}</p>
                  </td>
                  <td>
                    <p style={{ fontSize: 11, lineHeight: 1.2, margin: 0 }}>{decodeURIComponent(item[1])}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="col-12">
        <NumbersTable busy={false} onPage={numbers.length} list={numbers} />
      </div>
    </div>
  );
};

export default CustomerView;
