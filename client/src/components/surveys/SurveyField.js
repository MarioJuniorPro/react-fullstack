import React from "react";

export default ({ input, label, meta: { error, touched }, type }) => {
    return (
    <div>
      <label>{label}</label>
      <input {...input} type={type} style={{ margin: '5px'}} autoComplete="off"/>
      <div className="red-text" style={{marginBotton: '20px'}}>
      {touched && error}
      </div>
    </div>
  );
};
