// @flow
import React from 'react';
import FieldText from '@atlaskit/field-text';
import { FormContext } from '../Form';
import type { FormContextData, Field } from '../types';

class AtlaskitFieldText extends React.Component<Field> {
  constructor(props: Field) {
    super(props);
    const { registerField, onFieldChange, ...fieldDef } = props;
    registerField(fieldDef);
  }
  render() {
    const {
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      type,
      value,
      label,
      misc = {},
      onFieldChange
    } = this.props;
    return (
      <FieldText
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        value={value}
        onChange={(evt: any) => onFieldChange(id, evt.target.value)}
      />
    );
  }
}

export default (props: Field) => (
  <FormContext.Consumer>
    {form => <AtlaskitFieldText {...form} {...props} />}
  </FormContext.Consumer>
);
