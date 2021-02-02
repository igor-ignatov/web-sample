import React, { useEffect } from "react";

import { connect } from "react-redux";
import { get_number_info_api } from "../../components/NumberView/operations";

import NumberView from "../../components/NumberView";
import RootLayout from "../../layouts/root";

import type { ISession } from "../../common/types/session";

const NumberViewPage: React.FC<{ session: ISession; number: string; actions: any }> = ({ session, number, actions }) => {
  useEffect(() => {
    if (number) {
      actions.get_number_info(number);
    }
  }, []);

  return (
    <RootLayout session={session}>
      <NumberView session={session} />
    </RootLayout>
  );
};

export async function getServerSideProps({ req }) {
  const { session } = req;
  let number: string;

  try {
    number = req.params[0].replace(/\D/g, "");
  } catch (err) {
    console.log(err);
  }

  return {
    props: { session: JSON.parse(JSON.stringify(session)), number } // will be passed to the page component as props
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      get_number_info: (number) => dispatch(get_number_info_api(number))
    }
  };
}

export default connect(null, mapDispatchToProps)(NumberViewPage);
