// @flow
import type { FieldDef } from './forms/components/types';

const form1: FieldDef[] = [
  {
    id: 'NAME',
    name: 'name',
    label: 'Name?',
    value: 'bob',
    type: 'text',
    required: true,
    validWhen: {
      lengthIsGreaterThan: {
        length: 4,
        message: 'Name is too short!'
      }
    }
  },
  {
    id: 'NAME2',
    name: 'address',
    label: 'Address',
    type: 'textarea',
    placeholder: 'Enter address...',
    value: '',
    required: true,
    visibleWhen: [
      {
        field: 'NAME',
        isNot: ['hide']
      }
    ],
    disabledWhen: [
      {
        field: 'NAME',
        is: ['lock']
      }
    ]
  },
  {
    id: 'AGE',
    name: 'age',
    label: 'Age?',
    value: 18,
    type: 'text',
    visibleWhen: [
      {
        field: 'SHOW',
        isNot: [false]
      }
    ]
  },
  {
    id: 'SHOW',
    name: 'show',
    label: 'Show Age Field',
    value: true,
    type: 'checkbox'
  },
  {
    id: 'PICK',
    name: 'picker',
    label: 'Choose one',
    placeholder: 'Pick an item',
    value: 'b',
    type: 'select',
    options: [
      {
        items: ['a', 'b', 'c']
      }
    ]
  },
  {
    id: 'PICKAGAIN',
    name: 'colours',
    label: 'Choose a colour',
    placeholder: 'Pick a colour',
    value: 'G',
    type: 'radiogroup',
    options: [
      {
        items: [
          {
            label: 'Green',
            value: 'G'
          },
          {
            label: 'Red',
            value: 'R'
          },
          {
            label: 'Blue',
            value: 'B'
          }
        ]
      }
    ]
  },
  {
    id: 'PICKMORETHANONE',
    name: 'fruit',
    label: 'Pick some fruit',
    placeholder: 'Available fruits...',
    type: 'multiselect',
    value: 'apple,banana',
    valueDelimiter: ',',
    useChangesAsValues: true,
    options: [
      { items: ['apple', 'banana', 'kiwi', 'melon', 'grapefruit', 'plum'] }
    ]
  }
];

const formBuilder = [
  {
    id: 'ID',
    name: 'id',
    type: 'text',
    required: true,
    value: '',
    label: 'ID',
    placeholder: 'Enter a unique ID...'
  },
  {
    id: 'NAME',
    name: 'name',
    type: 'text',
    required: true,
    value: '',
    label: 'Name',
    placeholder: 'Enter the name for the field'
  },
  {
    id: 'TYPE',
    name: 'type',
    type: 'select',
    value: 'text',
    label: 'Type',
    placeholder: 'Choose a field type',
    options: [
      { items: ['text', 'textarea', 'select', 'radiogroup', 'checkbox'] }
    ]
  },
  {
    id: 'LABEL',
    name: 'label',
    type: 'text',
    required: false,
    value: '',
    label: 'Label',
    placeholder: 'Enter the label for the field'
  },
  {
    id: 'PLACEHOLDER',
    name: 'placeholder',
    type: 'text',
    required: false,
    value: '',
    label: 'Placeholder Text',
    placeholder: 'Placeholder...'
  },
  {
    id: 'VALUE',
    name: 'value',
    type: 'text',
    value: '',
    label: 'Initial value',
    placeholder: 'Enter initial value for the field...'
  }
];

export { form1, formBuilder };
