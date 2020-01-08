import React from "react";

const SuccessMessage = props => {
  return (
    <div className="ui success message">
      <div className="header">Invoice was submitted Successfully</div>
      <p>You may submit another invoice</p>
    </div>
  );
};

export default SuccessMessage;
