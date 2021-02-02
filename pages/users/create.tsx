import React from "react";

import RootLayout from "../../layouts/root";
import CreateUser from "../../components/Users/Create";

import { ISession } from "../../common/types/session";

const CreateUserPage: React.FC<{ session: ISession }> = ({ session }) => (
  <RootLayout session={session}>
    <CreateUser />
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

export default CreateUserPage;
