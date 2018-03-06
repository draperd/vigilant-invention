// @flow
import React, { Component } from "react";
import {
  processFields,
  registerFields,
  updateFieldValue,
  validateAllFields
} from "./utils";
import type { FieldDef, FormProps, FormState, OnChange } from "./types";

type SampleFieldProps = {
  field: FieldDef,
  onChange: OnChange
};

class SampleField extends Component<SampleFieldProps, void> {
  render() {
    const { field, onChange } = this.props;
    const {
      name,
      id,
      value,
      type,
      placeholder,
      visible,
      disabled,
      required
    } = field;
    if (!visible) {
      return null;
    }
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
          onChange={evt => onChange(id, evt.target.value)}
        />
      </div>
    );
  }
}

export default class Form extends Component<FormProps, FormState> {
  onFieldChange(id: string, value: any) {
    let { fields } = this.state;
    fields = updateFieldValue(id, value, fields);
    this.setState({
      fields
    });
  }

  constructor(props: FormProps) {
    super(props);
    const { fields } = props;
    this.state = {
      fields: registerFields(fields)
    };
  }

  renderField(field: FieldDef) {
    return (
      <SampleField
        key={field.id}
        field={field}
        onChange={this.onFieldChange.bind(this)}
      />
    );
  }

  render() {
    let { fields } = this.state;
    fields = processFields(fields);
    fields = validateAllFields(fields);
    const renderedFields = fields.map(field => this.renderField(field));
    return renderedFields;
  }
}
