// @flow
import React from 'react';
import SingleSelect from '@atlaskit/single-select';
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

class AtlaskitSelect extends React.Component<Field> {
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
    const {
      disabled,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      value,
      label,
      description,
      onFieldChange
    } = this.props;
    let defaultSelected;
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.map(option => {
      const { heading, items = [] } = option;
      return {
        heading,
        items: items.map(item => {
          if (typeof item === 'string') {
            const _item = {
              content: item,
              value: item,
              isSelected: item === value
            };
            if (_item.isSelected) {
              defaultSelected = _item;
            }
            return _item;
          } else {
            const _item = {
              content: item.label || item.value,
              value: item.value,
              isSelected: item.value === value
            };
            if (_item.isSelected) {
              defaultSelected = _item;
            }
            return _item;
          }
        })
      };
    });

    return (
      <Layout id={id}>
        <SingleSelect
          key={id}
          name={name}
          label={label}
          defaultSelected={defaultSelected}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={!isValid}
          value={stringValue}
          items={items}
          onSelected={evt => {
            onFieldChange(id, evt.item.value);
          }}
        />
        {description && (
          <Tooltip content={description} position="right">
            <InfoIcon primaryColor="#6554C0" />
          </Tooltip>
        )}
      </Layout>
    );
  }
}

export default (props: FieldDef) => (
  <FormContext.Consumer>
    {form => <AtlaskitSelect {...form} {...props} />}
  </FormContext.Consumer>
);
