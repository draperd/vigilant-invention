// @flow
import React, { Component, Fragment } from 'react';
import DefaultField from './DefaultField';
import {
  getNextStateFromFields,
  registerField,
  registerFields,
  updateFieldValue
} from './utils';
import type {
  FieldDef,
  FormContextData,
  FormProps,
  FormState,
  OnFieldChange,
  Value
} from './types';

export const FormContext = React.createContext();

export default class Form extends Component<FormProps, FormState> {
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
      const nextState = getNextStateFromFields(fields, optionsHandler);

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
    const nextState = getNextStateFromFields(fields, this.props.optionsHandler);

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

  createFormContext() {
    const { fields, value, isValid } = this.state;
    const { renderField = this.renderField } = this.props;
    const onFieldChange = this.onFieldChange.bind(this);

    const context: FormContextData = {
      fields,
      isValid,
      value,
      registerField: this.registerField.bind(this),
      renderField,
      options: {},
      onFieldChange
    };

    return context;
  }

  renderField(field: FieldDef, onChange: OnFieldChange) {
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

  renderFields(context: FormContextData) {
    const { fields, onFieldChange, renderField } = context;
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

  render() {
    const { children, defaultFields } = this.props;
    const context = this.createFormContext();
    return (
      <FormContext.Provider value={context}>
        <Fragment>{defaultFields && this.renderFields(context)}</Fragment>
        {children}
      </FormContext.Provider>
    );
  }
}
