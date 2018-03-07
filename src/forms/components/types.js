// @flow

export type Value = any;

export type Rule = {
  field: string,
  is?: Value[],
  isNot?: Value[]
};

export type FieldDef = {
  id: string,
  name: string,
  label?: string,
  placeholder?: string,
  type: string,
  defaultValue?: void | string | number | boolean | Array<any>,
  value: void | string | number | boolean | Array<any>,
  visible?: boolean,
  required?: boolean,
  disabled?: boolean,
  disabledWhen?: Rule[],
  visibleWhen?: Rule[],
  requiredWhen?: Rule[],
  validWhen?: ValidationRules,
  isValid?: boolean,
  errorMessages?: string,
  omitWhenHidden?: boolean,
  omitWhenValueIs?: Value[],
  useChangesAsValues?: boolean,
  valueDelimiter?: string,
  addedSuffix?: string,
  removedSuffix?: string,
  options?: OptionGroup[],
  misc?: {
    [string]: any
  }
};

export type Option =
  | {
      label?: string,
      value: Value,
      misc?: any
    }
  | string;

export type OptionGroup = {
  heading?: string,
  items: Option[]
};

export type Options = Option[] | OptionGroup[];

export type Validator = string;

export type ValidationRules = {
  [Validator]: any
};

export type FormValue = {
  [string]: Value
};

export type OnFormChange = (FormValue, boolean) => void;

export type FormProps = {
  fields: FieldDef[],
  value?: FormValue,
  onChange?: OnFormChange,
  renderField?: RenderField
};

export type FormState = {
  fields: FieldDef[],
  value: FormValue,
  isValid: boolean
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

export type SplitDelimitedValue = (Value, ?string) => string[] | string;
export type JoinDelimitedValue = (Value, ?string) => string | Value[];
export type GetMissingItems<T> = (Array<T>, Array<T>) => Array<T>;
export type DetermineChangedValues = FieldDef => Array<{
  name: string,
  value: Value
}>;

export type CalculateFormValue = (FieldDef[]) => FormValue;

export type OmitFieldValue = FieldDef => boolean;

export type RenderField = (FieldDef, OnChange) => any;
