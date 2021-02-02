import _ from "lodash";

import view_number from "../numbers/view";

import type { IActivation } from "../../../common/types/activations";
import type { INumberInfo } from "../../../common/types/numbers";
import type { IUser } from "../../../common/types/session";

function prepare_activations(user: IUser, activations: IActivation[], filters: Array<{ key: string; value: any }>, with_users: boolean = false): Promise<IActivation[]> {
  return new Promise((resolve, reject) => {
    const validate_query = _.filter(filters, (q) => !_.isEmpty(q.value));

    const valid_query: any[] = _.map(validate_query, (n) => {
      return { [n.key]: n.value };
    });
    // @ts-ignore
    const prep_query = _.assign(...valid_query);
    const filtered = valid_query.length > 0 ? _.filter(activations, prep_query) : activations;

    if (with_users) {
      const get_info_queue: Array<Promise<INumberInfo>> = [];

      filtered.forEach((activation) => {
        if (activation.number) get_info_queue.push(view_number(user, activation.number));
      });

      Promise.all(get_info_queue).then(results => {
        const prep_activations = [];
        console.log("info".bgBlue, results.length);

        results.forEach(info => {
          const act = filtered.find(f => f.number === info.number);

          if (act) {
            const user = info.request_history.find(h => h.request.url.includes("customer/activate"));

            if (user) {
              prep_activations.push(Object.assign(act, { user: user.user.name }));
            } else {
              console.log("user not found".bgRed, info.request_history);
            }
          } else {
            console.log("activation not found".bgRed, info.number);
          }
        });

        console.log("prep_activations".bgBlue, prep_activations.length);
        resolve(prep_activations);
      }).catch(error => reject(error));
    } else {
      setTimeout(() => resolve(filtered));
    }
  });
}

export default prepare_activations;
