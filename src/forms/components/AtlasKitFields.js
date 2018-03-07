// @flow
import React from 'react';
import FieldText from '@atlaskit/field-text';
import FieldTextArea from '@atlaskit/field-text-area';
import Checkbox from '@atlaskit/checkbox';
import RadioGroup from '@atlaskit/field-radio-group';
import SingleSelect from '@atlaskit/single-select';
import MultiSelect from '@atlaskit/multi-select';
import type { RenderField, FieldDef, OnChange } from './types';

const renderField: RenderField = (field: FieldDef, onChange: OnChange) => {
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
    label
  } = field;
  let items;
  let defaultSelected;
  const stringValue: string | void = value ? value.toString() : undefined;
  switch (type) {
    case 'text':
      return (
        <FieldText
          key={id}
          name={name}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={!isValid}
          invalid={errorMessages}
          value={stringValue}
          onChange={(evt: any) => onChange(id, evt.target.value)}
        />
      );

    case 'textarea':
      return (
        <FieldTextArea
          key={id}
          name={name}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={!isValid}
          value={stringValue}
          onChange={(evt: any) => onChange(id, evt.target.value)}
        />
      );

    case 'checkbox':
      return (
        //$FlowFixMe
        <Checkbox
          key={id}
          name={name}
          label={label}
          isDisabled={disabled}
          isInvalid={!isValid}
          value={stringValue}
          initiallyChecked={value}
          onChange={evt => onChange(id, evt.isChecked)}
        />
      );

    case 'select':
      items = options.map(option => ({
        heading: option.heading,
        items: option.items.map(item => {
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
      }));

      return (
        <div key={id}>
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
              onChange(id, evt.item.value);
            }}
          />
        </div>
      );

    case 'multiselect':
      const defaultSelectItems = [];
      items = options.map(option => ({
        heading: option.heading,
        items: option.items.map(item => {
          if (typeof item === 'string') {
            let isSelected = false;
            if (value && Array.isArray(value) && value.includes(item)) {
              isSelected = true;
            }
            const _item = {
              content: item,
              value: item,
              isSelected
            };
            if (_item.isSelected) {
              defaultSelectItems.push(_item);
            }
            return _item;
          } else {
            let isSelected = false;
            if (value && Array.isArray(value) && value.includes(item.value)) {
              isSelected = true;
            }
            const _item = {
              content: item.label || item.value,
              value: item.value,
              isSelected
            };
            if (_item.isSelected) {
              defaultSelectItems.push(_item);
            }
            return _item;
          }
        })
      }));

      return (
        <div key={id}>
          <MultiSelect
            key={id}
            name={name}
            label={label}
            defaultSelected={defaultSelectItems}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            isInvalid={!isValid}
            value={stringValue}
            items={items}
            onSelectedChange={evt => {
              onChange(id, evt.items.map(item => item.value));
            }}
          />
        </div>
      );

    case 'radiogroup':
      items = options.reduce((itemsSoFar, option) => {
        return itemsSoFar.concat(
          option.items.map(item => {
            if (typeof item === 'string') {
              const _item = {
                label: item,
                value: item,
                isSelected: item === value
              };
              if (_item.isSelected) {
                defaultSelected = _item;
              }
              return _item;
            } else {
              const _item = {
                label: item.label || item.value,
                value: item.value,
                isSelected: item.value === value
              };
              if (_item.isSelected) {
                defaultSelected = _item;
              }
              return _item;
            }
          })
        );
      }, []);

      return (
        <RadioGroup
          key={id}
          name={name}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={!isValid}
          value={stringValue}
          items={items}
          onRadioChange={(evt: any) => onChange(id, evt.target.value)}
        />
      );

    default:
      return <div>No mapped field</div>;
  }
};

export default renderField;
