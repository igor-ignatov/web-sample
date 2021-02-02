import _ from "lodash";

import { INumber } from "../../../common/types/numbers";

function group_numbers(numbers: INumber[], group: string) {
  const grouped = _.groupBy(numbers, group);
  const prep_group = [];

  for (const item of _.values(grouped)) {
    prep_group.push({ group: _.isEmpty(item[0].client) ? "pre-activated" : item[0].client, data: item });
  }

  return prep_group;
}

export default group_numbers;
