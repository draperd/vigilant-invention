import React, { Component } from 'react';
import Button from '@atlaskit/button';
import './App.css';

import Form from './forms/components/Form';
import renderField from './forms/components/AtlasKitFields';
import type { FieldDef } from './forms/components/types';

const fields: FieldDef[] = [
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
        fieldId: 'NAME',
        isNot: ['hide']
      }
    ],
    disabledWhen: [
      {
        fieldId: 'NAME',
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
        fieldId: 'SHOW',
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
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIsDisabled: false,
      formValue: {}
    };
  }
  render() {
    const { buttonIsDisabled, formValue } = this.state;
    return (
      <div className="App">
        <Form
          fields={fields}
          value={formValue}
          onChange={(formValue, isValid) => {
            this.setState({ formValue, buttonIsDisabled: !isValid });
          }}
          renderField={renderField}
        />
        <div>
          <Button
            appearance="primary"
            isDisabled={buttonIsDisabled}
            onClick={() => {
              console.log('Form value is', this.state.formValue);
            }}
          >
            OK
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
