import React from "react";
import { useToken } from "../../hooks";
import AuthedAction from "./AuthedAction";
import UnauthAction from "./UnauthAction";

interface Props {}

const HeaderAction: React.FC<Props> = () => {
  const { token } = useToken();

  return (
    <React.Fragment>
      {token ? <AuthedAction /> : <UnauthAction />}
    </React.Fragment>
  );
};

export default HeaderAction;
