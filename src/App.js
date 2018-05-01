import React, { Component } from 'react';
import Tabs from '@atlaskit/tabs';
import './App.css';

import Form from './forms/components/Form';
import FormFragment from './forms/components/FormFragment';
import renderAkField from './forms/components/AtlasKitFields';
import FormBuilder from './forms/components/FormBuilder';
import FieldText from './forms/components/Atlaskit/FieldText';
import FormButton from './forms/components/Atlaskit/FormButton';

import { OptionsHandler } from './forms/components/types';
import { createTeamForm, frag1, frag2 } from './definitions';

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

const tabs = [
  {
    label: 'Tab1',
    content: (
      <div>
        <FormFragment defaultFields={frag1} />
      </div>
    )
  },
  {
    label: 'Tab2',
    content: <FormFragment defaultFields={frag2} />
  }
];

const AppTabs = [
  {
    label: 'Single Definition',
    content: (
      <div>
        <p>
          This is an example of the Form component given a single form
          definition
        </p>
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
      </div>
    )
  },
  {
    label: 'Field components',
    content: (
      <div>
        <p>
          This is an example of a Form component with Field component children
        </p>
        <Form>
          <FieldText
            id="NAME"
            name="name"
            placeholder="Who are you?"
            value=""
            label="Name"
            description="Tell me a bit about yourself"
            required={true}
            visibleWhen={[{ field: 'SHOW', is: ['YES'] }]}
          />
          <FieldText
            id="SHOW"
            name="show"
            placeholder="Show the name field?"
            value="YES"
            label="Show"
          />
          <FormButton
            label="Save"
            onClick={(value: FormValue) =>
              console.log('Inline button value', value)
            }
          />
        </Form>
      </div>
    )
  },
  {
    label: 'Multiple definitions as fragments',
    content: (
      <div>
        <p>
          This is an example of a Form component with FormFragment components
          (each with their own definition) nested within a Tab container layout
          component.
        </p>
        <Form renderField={renderAkField}>
          <Tabs tabs={tabs} />
          <FormButton
            label="Frags"
            onClick={(value: FormValue) =>
              console.log('Multi fragment form button value', value)
            }
          />
        </Form>
      </div>
    )
  },
  {
    label: 'Form builder',
    content: (
      <div style={{ width: '100%' }}>
        <p>
          This is an example the FormBuilder component that can be used to
          dynamically build forms
        </p>
        <FormBuilder />
      </div>
    )
  }
];

class App extends Component {
  render() {
    return (
      <div>
        <Tabs tabs={AppTabs} />
      </div>
    );
  }
}

export default App;
