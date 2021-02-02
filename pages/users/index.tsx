import React, { useState } from "react";

import Users from "../../components/Users";
import RootLayout from "../../layouts/root";

import { ISession } from "../../common/types/session";

const UsersPage: React.FC<{ session: ISession }> = ({ session }) => (
  <RootLayout session={session}>
    <Users />
  </RootLayout>
);

export function getServerSideProps({ req, res }) {
  const { session } = req;

  if (session.user.role !== "god") {
    res.sendStatus(404);
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)) } // will be passed to the page component as props
  };
}

export default UsersPage;
