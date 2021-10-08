import React from "react";
import { Message } from "semantic-ui-react";

const ErrorPlaceholder = (props) => {
  const { description = "" } = props;
  return (
    <Message
      negative
      icon="warning sign"
      header="Error"
      content={description}
    />
  );
};

export default ErrorPlaceholder;
