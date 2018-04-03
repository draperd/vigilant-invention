// @flow
import React, { Component } from 'react';
import {
  calculateFormValue,
  processFields,
  processOptions,
  registerFields,
  updateFieldValue,
  validateAllFields
} from './utils';
import type {
  FieldDef,
  FormProps,
  FormState,
  OnChange,
  OptionsHandler,
  Value
} from './types';

type SampleFieldProps = {
  field: FieldDef,
  onChange: OnChange
};

class SampleField extends Component<SampleFieldProps, void> {
  render() {
    const { field, onChange } = this.props;
    const { name, id, value, type, placeholder, disabled, required } = field;
    const checked = type === 'checkbox' ? value : undefined;
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
              type === 'checkbox' ? evt.target.checked : evt.target.value
            )
          }
        />
      </div>
    );
  }
}

export default class Form extends Component<FormProps, FormState> {
  static getNextStateFromFields(
    fields: FieldDef[],
    optionsHandler?: OptionsHandler
  ) {
    fields = processFields(fields);
    if (optionsHandler) {
      fields = processOptions(fields, optionsHandler);
    }
    fields = validateAllFields(fields);
    const value = calculateFormValue(fields);
    const isValid = fields.every(field => field.isValid);
    const nextState = {
      fields,
      value,
      isValid
    };
    return nextState;
  }

  constructor(props: FormProps) {
    super(props);
    this.state = {
      fields: [],
      value: {},
      isValid: false,
      defaultFields: []
    };
  }

  static getDerivedStateFromProps(nextProps: FormProps, prevState: FormState) {
    if (nextProps.defaultFields !== prevState.defaultFields) {
      let { defaultFields, value: valueFromProps } = nextProps;
      const { value: valueFromState } = prevState;
      const fields = registerFields(
        defaultFields,
        valueFromProps || valueFromState || {}
      );

      const { optionsHandler } = nextProps;
      const nextState = Form.getNextStateFromFields(fields, optionsHandler);

      return {
        ...nextState,
        defaultFields
      };
    } else {
      return null;
    }
  }

  onFieldChange(id: string, value: Value) {
    let { fields } = this.state;
    fields = updateFieldValue(id, value, fields);
    const nextState = Form.getNextStateFromFields(
      fields,
      this.props.optionsHandler
    );

    this.setState(nextState, () => {
      const { onChange } = this.props;
      const { value, isValid } = this.state;
      if (onChange) {
        onChange(value, isValid);
      }
    });
  }

  renderField(field: FieldDef, onChange: OnChange) {
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
    const { renderField = this.renderField } = this.props;
    const onFieldChange = this.onFieldChange.bind(this);

    const renderedFields = fields.map(field => {
      const { visible } = field;
      if (visible) {
        return renderField(field, onFieldChange);
      }
      return null;
    });

    return renderedFields;
  }
}
