import {
  SET_NUMBERS_LIST,
  SET_NUMBERS_GROUP,
  SET_NUMBERS_DEALERS,
  TOGGLE_NUMBERS_FILTER,
  SET_NUMBERS_LIST_LENGTH,
  SET_NUMBERS_LIST_PAGE,
  SET_NUMBERS_TARIFFS,
  SET_NUMBERS_LIST_BUSY_STATE,
  SET_NUMBERS_STATUSES,
  SET_NUMBERS_SORTING_STATE
} from "../../redux/constants";

import type { INumber, INumbersStatus } from "../../common/types/numbers";

export const set_number_list = (list: INumber[]) => ({
  type: SET_NUMBERS_LIST,
  list
});

export const set_numbers_list_length = (length: number) => ({
  type: SET_NUMBERS_LIST_LENGTH,
  length
});

export const set_number_list_page = (page: number) => ({
  type: SET_NUMBERS_LIST_PAGE,
  page
});

export const set_numbers_dealers = (dealers: string[]) => ({
  type: SET_NUMBERS_DEALERS,
  dealers
});

export const set_number_group = (group: string) => ({
  type: SET_NUMBERS_GROUP,
  group
});

export const toggle_numbers_filter = (filter: { key: string; value: any }) => ({
  type: TOGGLE_NUMBERS_FILTER,
  filter
});

export const set_sorting_state = (sort: { key: string; direction: string }) => ({
  type: SET_NUMBERS_SORTING_STATE,
  sort
});

export const set_statuses = (statuses: INumbersStatus[]) => ({
  type: SET_NUMBERS_STATUSES,
  statuses
});

export const set_tariffs = (tariffs: string[]) => ({
  type: SET_NUMBERS_TARIFFS,
  tariffs
});

export const set_number_list_busy_state = (state: boolean) => ({
  type: SET_NUMBERS_LIST_BUSY_STATE,
  state
});
