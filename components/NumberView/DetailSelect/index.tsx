import React from "react";

import Router from "next/router";
import { MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemPredicate, ItemRenderer } from "@blueprintjs/select";

import type { IPeriods } from "..//types";

const periods: IPeriods[] = [
  { name: "3 дня", value: "3days" },
  { name: "прошлая неделя", value: "last_week" },
  { name: "эта неделя", value: "week" },
  { name: "прошлый месяц", value: "last_month" },
  { name: "этот месяц", value: "month" }
];

const PeriodSelect = Select.ofType<IPeriods>();

const filterStatuses: ItemPredicate<IPeriods> = (query, period) => {
  return period.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderStatus: ItemRenderer<IPeriods> = (period, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return <MenuItem active={modifiers.active} key={period.value} label={""} onClick={handleClick} text={period.name} />;
};

const DetailGroup: React.FC<{ number: string; busy: boolean }> = ({ number, busy }) => {
  return (
    <PeriodSelect
      activeItem={null}
      filterable={false}
      itemPredicate={filterStatuses}
      itemRenderer={renderStatus}
      items={periods}
      onItemSelect={(item) => {
        Router.push(`/${number}/detail/${item.value}`);
      }}>
      <Button small icon="chart" rightIcon="chevron-down" text={"Детализация"} disabled={busy} />
    </PeriodSelect>
  );
};

export default DetailGroup;
