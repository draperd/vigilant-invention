// @flow
import React, { Component } from "react";
import {
  calculateFormValue,
  processFields,
  registerFields,
  updateFieldValue,
  validateAllFields
} from "./utils";
import type {
  FieldDef,
  FormProps,
  FormState,
  FormValue,
  OnChange,
  Value
} from "./types";

type SampleFieldProps = {
  field: FieldDef,
  onChange: OnChange
};

class SampleField extends Component<SampleFieldProps, void> {
  render() {
    const { field, onChange } = this.props;
    const { name, id, value, type, placeholder, disabled, required } = field;
    const checked = type === "checkbox" ? value : undefined;
    return (
      <div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          checked={checked}
          onChange={evt =>
            onChange(
              id,
              type === "checkbox" ? evt.target.checked : evt.target.value
            )
          }
        />
      </div>
    );
  }
}

export default class Form extends Component<FormProps, FormState> {
  onFormUpdates(fields: FieldDef[]) {
    fields = processFields(fields);
    fields = validateAllFields(fields);
    const value = calculateFormValue(fields);
    const isValid = fields.every(field => field.isValid);
    this.setState(
      {
        fields,
        value,
        isValid
      },
      () => {
        const { onChange } = this.props;
        const { value, isValid } = this.state;
        if (onChange) {
          onChange(value, isValid);
        }
      }
    );
  }

  componentWillMount() {
    const { fields } = this.props;
    this.onFormUpdates(fields);
  }

  onFieldChange(id: string, value: Value) {
    let { fields } = this.state;
    fields = updateFieldValue(id, value, fields);
    this.onFormUpdates(fields);
  }

  renderField(field: FieldDef) {
    const { visible } = field;
    if (!visible) {
      return null;
    }
    return (
      <SampleField
        key={field.id}
        field={field}
        onChange={this.onFieldChange.bind(this)}
      />
    );
  }

  render() {
    const { fields } = this.state;
    const renderedFields = fields.map(field => this.renderField(field));
    return renderedFields;
  }
}
