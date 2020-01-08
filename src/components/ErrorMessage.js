import React from "react";

const ErrorMessage = ({ missingItems }) => {
  const errorsList = [];
  missingItems.forEach(error => {
    errorsList.push(<li>{error}</li>);
  });
  return (
    <div className="ui error message">
      <div className="header">There were some errors with your submission</div>
      <ul className="list">{errorsList}</ul>
    </div>
  );
};

export default ErrorMessage;
