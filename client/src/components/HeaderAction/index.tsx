import React from "react";
import { useToken } from "../../hooks";
import AuthedAction from "./AuthedAction";
import UnauthAction from "./UnauthAction";

interface Props {
  hideUserInfo?: boolean;
}

const HeaderAction: React.FC<Props> = ({ hideUserInfo = false }) => {
  const { token } = useToken();

  return (
    <React.Fragment>
      {token ? <AuthedAction hideUserInfo/> : <UnauthAction />}
    </React.Fragment>
  );
};

export default HeaderAction;
