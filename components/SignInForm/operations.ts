import Router from "next/router";
import { Position, Toaster, Intent } from "@blueprintjs/core";

import * as SignInActions from "./actions";
import { get_numbers_list_api } from "../NumbersList/operations";

import type { ThunkResult } from "../../redux/types";

export const set_sign_in_state_api = (state: boolean): ThunkResult<void> => (dispatch) => dispatch(SignInActions.set_sign_in_state(state));

export function subscribe_session(): ThunkResult<void> {
  return (dispatch, getState) => {
    // @ts-ignore
    const { mtxEventSource } = window;

    if (!mtxEventSource || (mtxEventSource && ![EventSource.OPEN, EventSource.CONNECTING].includes(mtxEventSource.readyState))) {
      const eventSource = new EventSource("/api_v1/sessions/subscribe", { withCredentials: true });

      // @ts-ignore
      window.mtxEventSource = eventSource;

      eventSource.onerror = (e: ErrorEvent) => {
        console.log("!!! EventSource onerror: ", e);

        eventSource.close();

        // @ts-ignore
        window.mtxEventSource = null;

        dispatch(subscribe_session());
      };

      eventSource.addEventListener("god_event", (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);

          if (parsed.text) {
            Toaster.create({
              className: "mtx-toaster",
              position: Position.BOTTOM_RIGHT
            }).show({
              intent: parsed.intent || Intent.PRIMARY,
              icon: parsed.icon,
              timeout: parsed.timeout || 5000,
              message: parsed.text
            });
          }
        } catch (err) {
          console.log("!!! EventSource numbers_update event error: ", err);
        }
      });

      eventSource.addEventListener("numbers_update", (e: MessageEvent) => {
        try {
          const { page } = getState().number_list_reducer;

          const parsed = JSON.parse(e.data);

          if (parsed.date) {
            dispatch(get_numbers_list_api(page));

            Toaster.create({
              className: "recipe-toaster",
              position: Position.BOTTOM_RIGHT
            }).show({
              intent: Intent.WARNING,
              icon: "updated",
              message: "Список номеров обновлен"
            });
          } else {
            console.log(">>> Numbers event withoud date: ", parsed);
          }
        } catch (err) {
          console.log("!!! EventSource numbers_update event error: ", err);
        }
      });
    }
  };
}

export function sign_in_api(login: string, pass: string): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/sessions/create", { body: JSON.stringify({ login, pass }) }))
        .then((result) => {
          Router.replace("/");

          dispatch(set_sign_in_state_api(true));

          resolve(result);
        })
        .catch((err) => reject(err));
    });
}

export function logout_api(): ThunkResult<Promise<any>> {
  return (dispatch, getState, { mtx }) =>
    new Promise((resolve, reject) => {
      dispatch(mtx.fetch("/api_v1/sessions/destroy"))
        .then((result) => {
          Router.reload();
          dispatch(set_sign_in_state_api(false));

          resolve(result);
        })
        .catch((err) => reject(err));
    });
}
