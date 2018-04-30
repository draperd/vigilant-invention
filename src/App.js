import React, { Component } from 'react';
import './App.css';

import Form from './forms/components/Form';
import renderAkField from './forms/components/AtlasKitFields';
import FormBuilder from './forms/components/FormBuilder';
import FieldText from './forms/components/Atlaskit/FieldText';
import FormButton from './forms/components/Atlaskit/FormButton';

import { OptionsHandler } from './forms/components/types';
import { createTeamForm } from './definitions';

const teamFormOptionsHandler: OptionsHandler = (fieldId: string) => {
  switch (fieldId) {
    case 'ISSUE_SOURCE':
      const options: Options = [
        {
          items: [
            {
              label: 'Board 1',
              value: 'BOARD1'
            },
            {
              label: 'Project A',
              value: 'PROJ_A'
            }
          ]
        }
      ];
      return options;
    default: {
      return null;
    }
  }
};

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <section>
            <Form
              defaultFields={createTeamForm}
              optionsHandler={teamFormOptionsHandler}
              renderField={renderAkField}
            >
              <FormButton
                onClick={(value: FormValue) =>
                  console.log('Definition button value', value)
                }
              />
            </Form>
          </section>
          <section>
            <Form>
              <FieldText
                id="NAME"
                name="name"
                placeholder="Who are you?"
                value=""
                label="Name"
                description="Tell me a bit about yourself"
                required={true}
              />
              <FormButton
                label="Save"
                onClick={(value: FormValue) =>
                  console.log('Inline button value', value)
                }
              />
            </Form>
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
