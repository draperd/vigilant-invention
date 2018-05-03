// @flow
import React, { Component } from 'react';
import Form from './Form';
import FormButton from './buttons/atlaskit/FormButton';
import renderField from '../renderers/AtlasKitFields';
import type { FieldDef, FormValue, OptionsHandler } from '../types';
import { formBuilder } from '../examples/definitions';

type Props = {};

type State = {
  previewFields: FieldDef[],
  builderFields: Array<any>,
  previewFormValue: any,
  previewFormButtonDisabled: boolean
};

const optionsHandler: OptionsHandler = (id, fields) => {
  console.log('Getting options for', id, fields);
  return [];
};

export default class FormBuilder extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      previewFields: [],
      builderFields: [],
      previewFormValue: {},
      previewFormButtonDisabled: false
    };
  }

  onBuilderFormChange(value: FormValue, isValid: boolean) {
    // console.log("Current form value", value.fields);
    this.setState({
      previewFields: value.fields
    });
  }

  render() {
    const { previewFields } = this.state;
    return (
      <div className="App">
        <section>
          <Form
            defaultFields={formBuilder}
            renderField={renderField}
            onChange={(value, isValid) =>
              this.onBuilderFormChange(value, isValid)
            }
            optionsHandler={optionsHandler}
          />
        </section>
        <section>
          <div>Preview</div>
          <Form defaultFields={previewFields.slice()} renderField={renderField}>
            <FormButton
              label="Test"
              onClick={(value: FormValue) =>
                console.log('Form preview value', value)
              }
            />
          </Form>
        </section>
      </div>
    );
  }
}
