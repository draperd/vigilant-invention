// @flow
import React, { Component } from 'react';
// import isEqual from "lodash/isEqual";
import Form from './Form';
// import Button from "@atlaskit/button";
import renderField from './AtlasKitFields';
import type { FieldDef, FormValue } from './types';
import { formBuilder } from '../../definitions';

type Props = {};

type State = {
  previewFields: FieldDef[],
  builderFields: Array<any>,
  previewFormValue: any,
  previewFormButtonDisabled: boolean
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

  fetchOptions(id: string) {
    // console.log('Fetching options for ', id);
    return;
  }
  render() {
    const {
      previewFields
      // previewFormValue,
      // previewFormButtonDisabled
    } = this.state;
    return (
      <div className="App">
        <section>
          <Form
            defaultFields={formBuilder}
            renderField={renderField}
            onChange={(value, isValid) =>
              this.onBuilderFormChange(value, isValid)
            }
            optionsHandler={id => this.fetchOptions(id)}
          />
        </section>
        <section>
          <div>Preview</div>
          <Form
            defaultFields={previewFields.slice()}
            renderField={renderField}
            // onChange={(value, isValid) => {
            //   if (!isEqual(value, previewFormValue)) {
            //     console.log("Form changed", value, isValid);
            //     this.setState({
            //       // previewFormValue,
            //       previewFormButtonDisabled: !isValid
            //     });
            //   }
            // }}
          />
          {/* <div>
            <Button
              disabled={previewFormButtonDisabled}
              onClick={() => {
                console.log("Preview Form Value", previewFormValue);
              }}
            >
              OK
            </Button>
          </div> */}
        </section>
      </div>
    );
  }
}
