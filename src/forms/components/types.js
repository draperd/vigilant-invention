// @flow

export type Value = any;

export type Rule = {
  fieldId: string,
  is?: Value[],
  isNot?: Value[]
};

export type FieldDef = {
  id: string,
  name: string,
  placeholder: string,
  type: string,
  value: void | string | number | boolean | Array<any>,
  visible: boolean,
  required: boolean,
  disabled: boolean,
  disabledWhen: Rule[],
  visibleWhen: Rule[],
  requiredWhen: Rule[],
  validWhen: ValidationRules,
  isValid: boolean,
  errorMessages: string
};

export type Validator = string;

export type ValidationRules = {
  [Validator]: any
};

export type FormValue = {
  [string]: Value
};

export type FormProps = {
  fields: FieldDef[],
  value?: FormValue
};

export type FormState = {
  fields: FieldDef[]
};

export type EvaluateRule = (rule?: Rule, targetValue: Value) => boolean;

export type FieldsById = {
  [string]: FieldDef
};

export type EvaluateAllRules = (
  rules: Rule[],
  fieldsById: FieldsById,
  defaultResult: boolean
) => boolean;

export type ProcessFields = (FieldDef[]) => FieldDef[];

export type ValidationResult = {
  isValid: boolean,
  errorMessages: string
};

export type ValidateField = FieldDef => FieldDef;

export type ValidateAllFields = (FieldDef[]) => FieldDef[];

export type CreateFieldDef = ($Shape<FieldDef>) => FieldDef;

export type MapFieldsById = (FieldDef[]) => FieldsById;

export type OnChange = (id: string, value: any) => void;

export type RegisterFields = (FieldDef[]) => FieldDef[];

export type UpdateFieldValue = (string, Value, FieldDef[]) => FieldDef[];
