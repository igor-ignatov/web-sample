import React, { useEffect } from "react";
import Router from "next/router";
import _ from "lodash";

import RootLayout from "../../layouts/root";
import EditUser from "../../components/Users/Edit";

import { ISession, IUser } from "../../common/types/session";

const EditUserPage: React.FC<{ session: ISession; user: IUser }> = ({ session, user }) => {
  useEffect(() => {
    if (_.isEmpty(user)) {
      Router.back();
    }
  }, []);

  return <RootLayout session={session}>{user && <EditUser user={user} />}</RootLayout>;
};

export function getServerSideProps({ req, res, nextApp }) {
  const { session, query } = req;

  if (session.user.role !== "god") {
    res.sendStatus(404);
  }

  let user;

  try {
    user = JSON.parse(decodeURIComponent(query.user));
  } catch (err) {
    console.log(err);
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)), user } // will be passed to the page component as props
  };
}

export default EditUserPage;
