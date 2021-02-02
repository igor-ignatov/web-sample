import React, { useEffect } from "react";

import Router from "next/router";
import { Button, Card, Icon } from "@blueprintjs/core";
import ClipLoader from "react-spinners/ClipLoader";

import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";

import SendUserPassword from "../SendPassword";
import { get_users_list_api } from "../operations";

import type { IRootState } from "../../../redux/types";

const UsersList: React.FC<{ actions: any; store: IRootState }> = ({ actions, store }) => {
  const { isFetching, users, dealers } = store.users_reducer;

  useEffect(() => {
    actions.get_users_list();
  }, []);

  return (
    <div className="row no-gutters users-list-container">
      {isFetching && (
        <div className="d-flex justify-content-center align-items-center" style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
          <ClipLoader color="#ff7700" />
        </div>
      )}
      <div className="col-auto py-3">
        <Button icon="plus" onClick={() => Router.push("/users/create")}>
          Создать
        </Button>
      </div>
      {users.length > 0 && (
        <div className="col-9 ml-3 py-3">
          <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small">
            <tbody>
              <tr>
                <td>Total: {users.length}</td>

                <td>Online: {users.filter((u) => u.online).length}</td>

                <td>Offline: {users.filter((u) => !u.online).length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {users.length > 0 && (
        <div className="col-auto">
          <Card>
            <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-html-table-striped bp3-interactive bp3-small">
              <thead>
                <tr>
                  <th />
                  <th>Дилер</th>
                  <th>Роль</th>
                  <th>Логин</th>
                  <th>Имя</th>
                  <th>email</th>
                  <th>Телефон</th>
                  <th>Last seen</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const dealer = _.find(dealers, { dlr_id: user.dlr_id });

                  return (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td>{user.online ? <span className="bp3-tag bp3-intent-success">online</span> : <span className="bp3-tag">offline</span>}</td>
                        <td>{dealer ? dealer.name : user.dlr_id}</td>
                        <td>{user.role}</td>
                        <td>{user.login}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.last_seen ? moment(user.last_seen).format("DD.MM.YYYY HH:mm") : ""}</td>
                        <td style={{ width: 40 }}>
                          <Button icon="edit" small onClick={() => Router.push({ pathname: "/users/edit", query: { user: encodeURIComponent(JSON.stringify(user)) }})}>
                            Редактировать
                          </Button>
                        </td>
                        <td style={{ width: 150 }}>
                          <SendUserPassword user={user} />
                        </td>
                      </tr>
                      {user.sessions.length > 0 && (
                        <tr>
                          <td/>
                          <td colSpan={9}>
                            <table className="bp3-html-table bp3-html-table-condensed bp3-small">
                              <tbody>
                                {user.sessions.map((session) => (
                                  <tr key={session.id} style={{ fontSize: 8 }}>
                                    <td><Icon icon={session.isMobile ? "mobile-phone" : "desktop"} iconSize={10} /></td>
                                    <td>{session.ip}</td>
                                    <td>{session.platform}</td>
                                    <td>{session.os}</td>
                                    <td>{session.browser} ({session.v})</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

function mapStateToProps(state) {
  return {
    store: {
      users_reducer: state.users_reducer
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      get_users_list: () => dispatch(get_users_list_api())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
