import React from "react";

import { Card } from "@blueprintjs/core";

import type { INumberActionsLog } from "../../../common/types/numbers";

const AccessLog: React.FC<{ logs: INumberActionsLog[] }> = ({ logs }) => {
  return (
    <div className="row no-gutters">
      {logs && logs.length > 0 && (
        <div className="col-12">
          <Card style={{ paddingTop: 10 }}>
            <h5>Access logs</h5>
            <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>date</th>
                  <th>user</th>
                  <th>ip</th>
                  <th>action</th>
                  <th>os</th>
                  <th>browser</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  let action: string;

                  if (log.request.url.includes("/api_v1/numbers/get_number_info")) {
                    action = "View contract";
                  } else if (log.request.url.includes("/api_v1/customer/activate")) {
                    action = "Activate contract";
                  } else if (log.request.url.includes("/api_v1/customer/edit")) {
                    action = "Edit contract";
                  } else if (log.request.url.includes("/api_v1/customer/toggle_service")) {
                    if (String(log.data.action) === "1") {
                      action = `Enable service with id ${log.data.service_id}`;
                    }

                    if (String(log.data.action) === "0") {
                      action = `Disable service with id ${log.data.service_id}`;
                    }
                  }

                  return (
                    <tr key={`log_${log._id}`}>
                      <td>
                        <p>{log.date}</p>
                      </td>
                      <td>
                        <p>{log.user.name}</p>
                      </td>
                      <td>
                        <p>{log.request.ip}</p>
                      </td>
                      <td>
                        <p>{action}</p>
                      </td>
                      <td>
                        <p>{log.request.os}</p>
                      </td>
                      <td>
                        <p>{log.request.browser}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AccessLog;
