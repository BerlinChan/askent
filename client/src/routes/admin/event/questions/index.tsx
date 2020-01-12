import React from "react";
import { useParams } from "react-router-dom";

const Questions: React.FC = () => {
  let { id } = useParams();

  return (
    <React.Fragment>
      <div>Event Questions</div> {id}
    </React.Fragment>
  );
};

export default Questions;
