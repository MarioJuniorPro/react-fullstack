import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmail";
import formFields from "./formFields"

class SurveyForm extends Component {
  renderFields() {
    return formFields.map(({ label, name, type = "text" }) => {
      return (
        <Field
          component={SurveyField}
          type={type}
          label={label}
          name={name}
          key={label}
        />
      );
    });
  }
  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit )}>
        {this.renderFields()}

        <Link to="/surveys" className="red btn-flat white-text">
          Cancel
        </Link>

        <button type="submit" className="teal btn-flat right white-text">
          Next
          <i className="material-icons right">done</i>
        </button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.emails = validateEmails(values.recipients || '')

  formFields.forEach(({ name, label }) => {
    if (!values[name]) {
      errors[name] = `You must provide a value for ${label}`;
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);
