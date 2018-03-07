// @flow
import React from 'react';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Checkbox from '@atlaskit/checkbox';
import type { RenderField } from './types';

const renderField: RenderField = (field, onChange) => {
  const { id, type, value } = field;
  switch (type) {
    case 'text':
      return (
        <FieldText
          key={id}
          {...field}
          onChange={evt => onChange(id, evt.target.value)}
        />
      );

    case 'textarea':
      return (
        <FieldTextArea
          key={id}
          {...field}
          onChange={evt => {
            onChange(id, evt.target.value);
          }}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          key={id}
          {...field}
          initiallyChecked={value}
          onChange={evt => onChange(id, evt.isChecked)}
        />
      );

    default:
      return <div>No mapped field</div>;
  }
};

export default renderField;
