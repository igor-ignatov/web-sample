import React, { useState } from "react";

import { Button } from "@blueprintjs/core";

import { connect } from "react-redux";
import { logout_api } from "../operations";

interface Props {
  actions: any;
}

const LogoutButton: React.FC<Props> = ({ actions }) => {
  const [busy, set_busy] = useState<boolean>(false);

  return (
    <Button
      loading={busy}
      minimal
      icon="log-out"
      onClick={async () => {
        set_busy(true);
        await actions.logout();
      }}
    />
  );
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      logout: () => dispatch(logout_api())
    }
  };
}

export default connect(null, mapDispatchToProps)(LogoutButton);
