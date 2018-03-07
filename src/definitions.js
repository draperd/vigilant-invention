// @flow
import type { FieldDef } from './forms/components/types';

const form1: FieldDef[] = [
  {
    id: 'NAME',
    name: 'name',
    label: 'Name?',
    value: 'bob',
    type: 'text',
    required: true
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

export { form1 };
