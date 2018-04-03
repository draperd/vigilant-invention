// @flow
import React, { Component } from 'react';
import DefaultField from './DefaultField';
import {
  calculateFormValue,
  processFields,
  processOptions,
  registerField,
  registerFields,
  updateFieldValue,
  validateAllFields
} from './utils';
import type {
  FieldDef,
  FormContextData,
  FormProps,
  FormState,
  OnChange,
  OptionsHandler,
  Options,
  Value
} from './types';

export const FormContext = React.createContext();

export default class Form extends Component<FormProps, FormState> {
  // This function needs to be static because it is called from getDerivedStateFromProps which is also static, but it is
  // also called from onFieldChanged which is not static
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
    if (
      nextProps.defaultFields &&
      nextProps.defaultFields !== prevState.defaultFields
    ) {
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

  // Register field is provided in the context to allow children to register with this form...
  registerField(field: FieldDef) {
    let { fields = [], value = {} } = this.state;
    fields = registerField(field, fields, value);
    this.setState({
      fields
    });
  }

  renderField(field: FieldDef, onChange: OnChange) {
    const { visible } = field;
    if (!visible) {
      return null;
    }
    return (
      <DefaultField
        key={field.id}
        field={field}
        onChange={this.onFieldChange.bind(this)}
      />
    );
  }

  render() {
    const { fields, value, isValid } = this.state;
    const {
      children,
      defaultFields,
      renderField = this.renderField
    } = this.props;
    const onFieldChange = this.onFieldChange.bind(this);

    const context: FormContextData = {
      fields,
      isValid,
      value,
      registerField: this.registerField.bind(this),
      options: {},
      onFieldChange
    };
    if (defaultFields) {
      const renderedFields = fields.map(field => {
        const { visible } = field;
        if (visible) {
          return renderField(field, onFieldChange);
        }
        return null;
      });

      return (
        <FormContext.Provider value={context}>
          {renderedFields}
        </FormContext.Provider>
      );
    }
    return (
      <FormContext.Provider value={context}>{children}</FormContext.Provider>
    );
  }
}
