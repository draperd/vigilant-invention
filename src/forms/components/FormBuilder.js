// @flow
import React, { Component } from 'react';
import Form from './Form';
import renderField from './AtlasKitFields';
import type { FieldDef } from './types';
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

  addField() {
    const { builderFields } = this.state;
    const targetIndex = builderFields.length;
    builderFields[targetIndex] = (
      <Form
        fields={formBuilder}
        renderField={renderField}
        onChange={(value, isValid) => {
          const { previewFields } = this.state;
          previewFields[targetIndex] = value;
          this.setState({
            previewFields
          });
        }}
      />
    );
    this.setState({ builderFields });
  }
  render() {
    const { previewFields, builderFields } = this.state;
    return (
      <div className="App">
        <section>
          <div>Builder</div>
          <div>{builderFields}</div>
          <button onClick={() => this.addField()}>Add Field</button>
        </section>
        <section>
          <div>Preview</div>
          <Form fields={previewFields.slice()} renderField={renderField} />
        </section>
      </div>
    );
  }
}
