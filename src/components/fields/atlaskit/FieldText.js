// @flow
import React from 'react';
import FieldText from '@atlaskit/field-text';
import InfoIcon from '@atlaskit/icon/glyph/info';
import Tooltip from '@atlaskit/tooltip';
import styled from 'styled-components';
import { FormContext } from '../../Form';
import type { Field, FieldDef } from '../../../types';

const Layout = styled.div`
  > div {
    display: inline-block;
  }

  > div:nth-child(2) {
    margin-left: 10px;
    line-height: 32px;
    vertical-align: bottom;
  }
`;

class AtlaskitFieldText extends React.Component<Field> {
  constructor(props: Field) {
    super(props);
    const { registerField, onFieldChange, ...fieldDef } = props;
    if (registerField) {
      registerField(fieldDef);
    } else {
      console.warn(
        'Could not register field because registerField function was missing',
        fieldDef
      );
    }
  }
  render() {
    const { id, fields = [], onFieldChange } = this.props;
    const fieldToRender = fields.find(field => field.id === id);
    if (fieldToRender && fieldToRender.visible) {
      const {
        disabled,
        errorMessages,
        id,
        isValid,
        name,
        placeholder,
        required,
        value,
        label,
        description
      } = fieldToRender;
      return (
        <Layout id={id}>
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
          {description && (
            <Tooltip content={description} position="right">
              <InfoIcon primaryColor="#6554C0" />
            </Tooltip>
          )}
        </Layout>
      );
    }

    return null;
  }
}

export default (props: FieldDef) => (
  <FormContext.Consumer>
    {form => <AtlaskitFieldText {...form} {...props} />}
  </FormContext.Consumer>
);
