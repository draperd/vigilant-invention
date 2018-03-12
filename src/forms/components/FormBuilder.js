// @flow
import React, { Component } from 'react';
import Form from './Form';
import renderField from './AtlasKitFields';
import type { FieldDef, FormValue } from './types';
import { formBuilder } from '../../definitions';

type Props = {};

type State = {
  previewFields: FieldDef[],
  builderFields: Array<any>
};

export default class FormBuilder extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      previewFields: [],
      builderFields: []
    };
  }

  onBuilderFormChange(value: FormValue, isValid: boolean) {
    // console.log("Current form value", value.fields);
    this.setState({
      previewFields: value.fields
    });
  }

  fetchOptions(id: string) {
    // console.log('Fetching options for ', id);
    return;
  }
  render() {
    const { previewFields } = this.state;
    return (
      <div className="App">
        <section>
          <Form
            fields={formBuilder}
            renderField={renderField}
            onChange={(value, isValid) =>
              this.onBuilderFormChange(value, isValid)
            }
            optionsHandler={id => this.fetchOptions(id)}
          />
        </section>
        <section>
          <div>Preview</div>
          <Form fields={previewFields.slice()} renderField={renderField} />
        </section>
      </div>
    );
  }
}
