import React, { useEffect } from "react";

import { connect } from "react-redux";
import Deatil from "../../../components/Detail";
import RootLayout from "../../../layouts/root";

import { fetch_detail_api } from "../../../components/Detail/operations";

import { ISession } from "../../../common/types/session";

interface Props {
  session: ISession;
  actions: any;
  number: string;
  period: string;
}

const NumberDetailPage: React.FC<Props> = ({ session, actions, number, period }) => {
  useEffect(() => {
    if (number && period) {
      actions.fetch_detail(number, period);
    }
  }, []);

  return (
    <RootLayout session={session}>
      <Deatil current_period={period} number={number} />
    </RootLayout>
  );
};

export async function getServerSideProps({ req }) {
  const { session } = req;
  const cloned_session = JSON.parse(JSON.stringify(session));

  let number;
  let period;

  try {
    number = req.params[0].split("/")[1];
    period = req.params[0].split("/")[3];

    cloned_session.detail = number;
  } catch (err) {
    console.log(err);
  }

  return {
    props: { session: cloned_session, number, period } // will be passed to the page component as props
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetch_detail: (number, period) => dispatch(fetch_detail_api(number, period))
    }
  };
}

export default connect(null, mapDispatchToProps)(NumberDetailPage);
