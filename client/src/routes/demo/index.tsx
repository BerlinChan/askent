import React from "react";
import { Button } from "@material-ui/core";
import {
  useCheckEventCodeExistQuery,
  usePackageInfoMutation
} from "../../generated/graphqlHooks";

const Demo: React.FC = props => {
  const { data: checkData, loading, error } = useCheckEventCodeExistQuery({
    variables: { code: "code" }
  });
  const [packageInfoMutation, { data: infoData }] = usePackageInfoMutation();
  console.log(checkData, error, infoData);

  return (
    <React.Fragment>
      <p>
        演示使用 codegen 生成的 hooks。这些 hooks 实际是 @apollo/react-hooks
        的包装， 他们的使用可参见{" "}
        <a href="https://www.apollographql.com/docs/tutorial/introduction/">
          官方教程
        </a>
        ， 以及{" "}
        <a href="https://github.com/apollographql/fullstack-tutorial">
          example repository
        </a>
        。
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          packageInfoMutation({
            variables: { version: "0.2.0", description: "Some text" }
          })
        }
      >
        package Info Mutation
      </Button>
    </React.Fragment>
  );
};

export default Demo;
