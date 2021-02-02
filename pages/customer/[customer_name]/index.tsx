import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { fetch_client_info_api } from "../../../components/CustomerView/operations";

import CustomerView from "../../../components/CustomerView";
import RootLayout from "../../../layouts/root";

import type { ISession } from "../../../common/types/session";

const ClientViewPage: React.FC<{ session: ISession; customer_name: string; actions: any }> = ({ session, customer_name, actions }) => {
  const [customer_info, set_customer_info] = useState(null);
  const [error, set_error] = useState(false);

  useEffect(() => {
    if (customer_name) {
      actions
        .fetch_client_info(customer_name)
        .then((resp) => set_customer_info(resp))
        .catch(() => set_error(true));
    }
  }, []);

  return <RootLayout session={session}>{customer_info && <CustomerView customer_info={customer_info} />}</RootLayout>;
};

export async function getServerSideProps({ req }) {
  const { session } = req;
  let customer_name: string;

  try {
    customer_name = req.params[0].replace("/customer/", "");
  } catch (err) {
    console.log(err);
  }

  console.log("+++++++++++++", customer_name);

  return {
    props: { session: JSON.parse(JSON.stringify(session)), customer_name: decodeURIComponent(customer_name) } // will be passed to the page component as props
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetch_client_info: (customer: string) => dispatch(fetch_client_info_api(customer))
    }
  };
}

export default connect(null, mapDispatchToProps)(ClientViewPage);
