import React, { Component } from 'react';
import Button from '@atlaskit/button';
import './App.css';

import Form from './forms/components/Form';
import renderAkField from './forms/components/AtlasKitFields';
import renderNativeField from './forms/components/NativeFields';
import FormBuilder from './forms/components/FormBuilder';

import { form1 } from './definitions';

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
      <div>
        <div className="App">
          <section>
            <Form
              defaultFields={form1}
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
              defaultFields={form1}
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
                  console.log(
                    'Native form value is',
                    this.state.nativeFormValue
                  );
                }}
              >
                OK
              </button>
            </div>
          </section>
        </div>
        <div>
          <FormBuilder />
        </div>
      </div>
    );
  }
}

export default App;
