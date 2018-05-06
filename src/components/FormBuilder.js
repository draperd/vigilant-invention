// @flow
import React, { Component } from 'react';
import Form from './Form';
import FormButton from './buttons/atlaskit/FormButton';
import renderField from '../renderers/AtlasKitFields';
import type {
  FieldDef,
  FormContextData,
  FormValue,
  Options,
  OptionsHandler
} from '../types';
import { formBuilder } from '../examples/definitions';

type Props = {};

type State = {
  previewFields: FieldDef[],
  builderFields: Array<any>,
  previewFormValue: any,
  previewFormButtonDisabled: boolean
};

const getDefinedFields = (parentContext: ?FormContextData): Options => {
  if (
    parentContext &&
    parentContext.parentContext &&
    parentContext.parentContext.fields &&
    parentContext.parentContext.fields.length &&
    parentContext.parentContext.fields[0].value
  ) {
    const value = parentContext.parentContext.fields[0].value;
    if (Array.isArray(value)) {
      const fields = [];
      value.forEach(field => {
        if (field.id) {
          fields.push({
            value: field.id
          });
        }
      });
      return [
        {
          items: fields
        }
      ];
    }
    return [];
  }
};

const optionsHandler: OptionsHandler = (id, fields, parentContext) => {
  if (id === 'FIELD') {
    const definedFields = getDefinedFields(parentContext);
    return definedFields;
  }
  return null;
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
