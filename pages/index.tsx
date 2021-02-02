import React from "react";
import _ from "lodash";

import NumbersList from "../components/NumbersList";
import RootLayout from "../layouts/root";

import { ISession } from "../common/types/session";

const Home: React.FC<{ session: ISession }> = ({ session }) => (
  <RootLayout session={session}>
    <NumbersList />
  </RootLayout>
);

export function getServerSideProps({ req }) {
  const { session } = req;

  return {
    props: { session: JSON.parse(JSON.stringify(session)) }
  };
}

export default Home;
