import React, { useState } from "react";

import { Switch, Alert, Intent } from "@blueprintjs/core";
import ClipLoader from "react-spinners/ClipLoader";
import _ from "lodash";
import { connect } from "react-redux";
import { toggle_service_api } from "../../operations";

import { IPackItem } from "../../../../common/types/numbers";

interface Props {
  service: IPackItem;
  actions: any;
  accepted: boolean;
}

const ServiceItem: React.FC<Props> = ({ service, actions, accepted }) => {
  const [busy, set_busy] = useState<boolean>(false);
  const [open, set_open] = useState<boolean>(false);
  const [error, set_error] = useState<boolean>(false);

  const toogle_service = async () => {
    set_busy(true);
    set_error(false);
    await actions.toggle_service(service.id, service.status === "disable" ? 1 : 0).catch((err) => {
      console.log("!!! Toggle service error: ", err);
      set_error(err.error.error || true);
    });
    set_busy(false);
  };

  return (
    <tr>
      <td>
        <p>{service.id}</p>
      </td>
      <td>
        <p>{service.name}</p>
      </td>
      <td>
        <p>{service.start_date}</p>
      </td>
      <td>
        <p>{service.end_date}</p>
      </td>
      <td>
        <p>{service.start_amt}</p>
      </td>
      <td>
        <p>{service.abon_amt}</p>
      </td>
      <td>
        <p>{service.next_bdat}</p>
      </td>

      <td className="d-flex justify-content-end align-items-center">
        {error && (
          <div className="alert alert-danger" role="alert" style={{ fontSize: 10, padding: "3px 7px", lineHeight: 1, margin: "0 10px 0 0", borderRadius: 50 }}>
            {_.isString(error) ? error : "Ошибка"}
          </div>
        )}
        {busy ? (
          <ClipLoader color="#ff7700" size={20} />
        ) : (
          <>
            {service.avaliable && (
              <Switch
                style={{ margin: 0 }}
                disabled={busy || !accepted}
                color="#ff7700"
                onChange={async () => {
                  set_open(true);
                }}
                checked={service.status !== "disable"}
              />
            )}
            <Alert
              confirmButtonText={service.status === "disable" ? "Подключить" : "Отключить"}
              intent={service.status === "disable" ? Intent.SUCCESS : Intent.DANGER}
              isOpen={open}
              onClose={() => set_open(false)}
              canOutsideClickCancel
              canEscapeKeyCancel
              onCancel={() => set_open(false)}
              onConfirm={toogle_service}>
              <h5 style={{ fontSize: 16 }}>{service.status === "disable" ? `Подключить ${service.name}?` : `Отключить ${service.name}?`}</h5>
            </Alert>
          </>
        )}
      </td>
    </tr>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      toggle_service: (service_id, action) => dispatch(toggle_service_api(service_id, action))
    }
  };
}

export default connect(null, mapDispatchToProps)(ServiceItem);
