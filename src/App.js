import React, { Component } from 'react';
import Button from '@atlaskit/button';
import './App.css';

import Form from './forms/components/Form';
import renderAkField from './forms/components/AtlasKitFields';
import renderNativeField from './forms/components/NativeFields';
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
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      akButtonDisabled: false,
      akFormValue: {},
      nativeButtonIsDisabled: false,
      nativeFormValue: {}
    };
  }
  render() {
    const {
      akButtonDisabled,
      akFormValue,
      nativeButtonIsDisabled,
      nativeFormValue
    } = this.state;
    return (
      <div className="App">
        <section>
          <Form
            fields={fields}
            value={akFormValue}
            onChange={(akFormValue, isValid) => {
              this.setState({ akFormValue, akButtonDisabled: !isValid });
            }}
            renderField={renderAkField}
          />
          <div>
            <Button
              appearance="primary"
              isDisabled={akButtonDisabled}
              onClick={() => {
                console.log('AtlasKit Form value is', this.state.akFormValue);
              }}
            >
              OK
            </Button>
          </div>
        </section>
        <section>
          <Form
            fields={fields}
            value={nativeFormValue}
            onChange={(nativeFormValue, isValid) => {
              this.setState({
                nativeFormValue,
                nativeButtonIsDisabled: !isValid
              });
            }}
            renderField={renderNativeField}
          />
          <div>
            <button
              disabled={nativeButtonIsDisabled}
              onClick={() => {
                console.log('Native form value is', this.state.nativeFormValue);
              }}
            >
              OK
            </button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
