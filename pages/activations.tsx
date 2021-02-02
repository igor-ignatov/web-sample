import React from "react";

import Activations from "../components/Activations";
import RootLayout from "../layouts/root";

import { ISession } from "../common/types/session";

const ActivationsPage: React.FC<{ session: ISession }> = ({ session }) => {
  return (
    <RootLayout session={session}>
      <Activations />
    </RootLayout>
  );
};

export function getServerSideProps({ req }) {
  const { session } = req;

  return {
    props: { session: JSON.parse(JSON.stringify(session)) } // will be passed to the page component as props
  };
}

export default ActivationsPage;
