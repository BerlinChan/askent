import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";

const Questions: React.FC = () => {
  let { id } = useParams();
  const { url, path } = useRouteMatch();

  return (
    <React.Fragment>
      <div>Event Questions</div>
      <ul>
        <li> id: {id}</li>
        <li> path: {path}</li>
        <li> url: {url}</li>
      </ul>
    </React.Fragment>
  );
};

export default Questions;
