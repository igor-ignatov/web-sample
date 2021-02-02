import React from "react";

import _ from "lodash";
import ServiceItem from "./ServiceItem";
import { Card } from "@blueprintjs/core";

import { INumberInfo } from "../../../common/types/numbers";

const ServicesList: React.FC<{ selected_number: INumberInfo; accepted: boolean }> = ({ selected_number, accepted }) => {
  return (
    <div className="row no-gutters">
      {selected_number.matrix_packs && selected_number.matrix_packs.length > 0 && (
        <div className="col-12">
          <Card style={{ paddingTop: 10 }}>
            <h5>Services</h5>
            <table
              className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small"
              style={_.isEmpty(selected_number.customer) || !accepted ? { opacity: 0.5, pointerEvents: "none", width: "100%" } : { width: "100%" }}>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>start</th>
                  <th>end</th>
                  <th>start amount</th>
                  <th>abon amount</th>
                  <th>next bill date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {selected_number.matrix_packs.map((service) => (
                  <ServiceItem key={service.id} service={service} accepted={accepted} />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
