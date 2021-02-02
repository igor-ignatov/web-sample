import _ from "lodash";

import group_numbers from "./group_numbers";
import moment from "moment";

import type { INumber, IGetNumbersOptions, INumbersStatus } from "../../../common/types/numbers";

function prepare_numbers(numbers: INumber[], start: number | undefined, end: number | undefined, options: IGetNumbersOptions) {
  const { query, sort, group } = options;

  let statuses: INumbersStatus[] = _.toPairs(_.countBy(numbers, "status"));
  const tariffs: string[] = _.uniq(_.map(numbers, "tariff"));
  const dealers: Array<{ id: string; name: string }> = _.map(_.uniq(_.map(numbers, "dlr_id")), (d) => {
    if (d === "1121") {
      return { id: "1121", name: "UIS" };
    } else if (d === "978") {
      return { id: "978", name: "Omicron" };
    } else if (d === "0") {
      return { id: "0", name: "MTX" };
    } else {
      return { id: d, name: d };
    }
  });
  let filtered: INumber[] = numbers;

  if (query && _.isArray(query)) {
    const validate_query = _.filter(query, (q) => !_.isEmpty(q.value));

    const valid_query: any[] = _.map(validate_query, (n) => {
      const new_obj = {};
      new_obj[n.key] = n.value;

      return new_obj;
    });
    console.log("valid_query", valid_query);

    // @ts-ignore
    filtered = valid_query.length > 0 ? _.filter(numbers, _.assign(...valid_query)) : numbers;

    if (valid_query[0] && (valid_query[0].tariff || valid_query[0].dlr_id)) {
      const status_filters_arr = _.filter(validate_query, (f) => ["dlr_id", "tariff"].includes(f.key));
      const status_filters = _.map(status_filters_arr, (n) => {
        const new_obj = {};
        new_obj[n.key] = n.value;

        return new_obj;
      });
      // @ts-ignore
      statuses = _.toPairs(_.countBy(_.filter(numbers, _.assign(...status_filters)), "status"));
    }
  }

  const l = filtered.length;

  let sorted: INumber[] = filtered;

  if (sort) {
    sorted = _.orderBy(
      filtered,
      (s) => {
        if (sort.key.includes("date")) {
          if (_.isEmpty(s[sort.key])) {
            return 0;
          }

          return moment(s[sort.key], "DD.MM.YY kk:mm:ss").toDate();
        }

        if (sort.key === "contract_number") {
          const prep = s[sort.key].replace(/\D/g, "").trim();

          if (_.isEmpty(prep)) {
            return 0;
          }

          return Number(prep);
        }

        if (sort.key === "number") {
          return Number(s[sort.key]);
        }

        if (sort.key === "balance") {
          return Number(s[sort.key]);
        }

        if (sort.key === "client") {
          if (_.isEmpty(s[sort.key])) {
            return 0;
          }

          return s[sort.key];
        }

        return s[sort.key];
      },
      sort.direction
    );
  }

  let paged: INumber[] = sorted;

  if (typeof start === "number" && typeof end === "number") {
    paged = start > sorted.length ? sorted.slice(0, end) : sorted.slice(start, end);
  }
  const grouped: INumber[] = group ? group_numbers(paged, group) : paged;

  return { numbers: grouped, l, statuses, tariffs, dealers };
}

export default prepare_numbers;
