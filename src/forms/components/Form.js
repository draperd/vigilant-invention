// @flow
import React, { Component } from 'react';
import FormFragment from './FormFragment';
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
      const { value: valueFromState } = prevState;

      let { defaultFields, value: valueFromProps } = nextProps;
      const { optionsHandler } = nextProps;
      const fields = registerFields(
        defaultFields,
        valueFromProps || valueFromState || {}
      );
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

    if (fields.find(existingField => field.id === existingField.id)) {
      // Don't register fields twice...
      // console.warn("Field ID already in use", field.id);
    } else {
      fields = registerField(field, fields, value);
      this.setState((state, props) => {
        let updatedFields = fields.concat(state.fields);
        const nextState = getNextStateFromFields(
          updatedFields,
          props.optionsHandler
        );
        return {
          ...nextState
        };
      });
    }
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
    return <DefaultField key={field.id} field={field} onChange={onChange} />;
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
    const { fields } = this.state;
    const context = this.createFormContext();
    return (
      <FormContext.Provider value={context}>
        {defaultFields && <FormFragment defaultFields={fields} />}
        {children}
      </FormContext.Provider>
    );
  }
}
