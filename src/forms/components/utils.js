// @flow
// import set from 'lodash/get';
import { validateAllFields } from '../utilities/validation';
import type {
  CalculateFormValue,
  CreateFieldDef,
  DetermineChangedValues,
  EvaluateRule,
  EvaluateAllRules,
  FieldDef,
  GetMissingItems,
  JoinDelimitedValue,
  MapFieldsById,
  OmitFieldValue,
  OptionsHandler,
  ProcessFields,
  ProcessOptions,
  RegisterField,
  RegisterFields,
  SplitDelimitedValue,
  UpdateFieldValue,
  Value
} from './types';

export const getNextStateFromFields = (
  fields: FieldDef[],
  optionsHandler?: OptionsHandler
) => {
  fields = processFields(fields);
  if (optionsHandler) {
    fields = processOptions(fields, optionsHandler);
  }
  fields = validateAllFields(fields);
  const value = calculateFormValue(fields);
  const isValid = fields.every(field => field.isValid);
  const nextState = {
    fields,
    value,
    isValid
  };
  return nextState;
};

// A field definition is valid if a field with the same id does not already exist in
// the supplied form state.
// We are assuming that typing takes care that all required attributes are present
export const fieldDefIsValid = (field: FieldDef, fields: FieldDef[]) => {
  return !fields.some(currentField => currentField.id === field.id);
};

export const valuesMatch = (a: Value, b: Value) => {
  if (a && b) {
    return a.toString() === b.toString();
  } else {
    return a === b;
  }
};

export const evaluateRule: EvaluateRule = (rule = {}, targetValue) => {
  const { is = [], isNot = [] } = rule;
  let hasValidValue = is.length === 0;
  let hasInvalidValue = !!rule.isNot && rule.isNot.length > 0;

  if (hasInvalidValue) {
    hasInvalidValue = isNot.some(invalidValue => {
      if (invalidValue.hasOwnProperty('value')) {
        return valuesMatch(invalidValue.value, targetValue);
      } else {
        return valuesMatch(invalidValue, targetValue);
      }
    });
  }

  if (!hasInvalidValue && !hasValidValue) {
    if (rule.is && rule.is.length) {
      hasValidValue = rule.is.some(validValue => {
        if (validValue.hasOwnProperty('value')) {
          return valuesMatch(validValue.value, targetValue);
        } else {
          return valuesMatch(validValue, targetValue);
        }
      });
    }
  }
  return hasValidValue && !hasInvalidValue;
};

export const evaluateAllRules: EvaluateAllRules = (
  rules = [],
  fieldsById = {},
  defaultResult = true
) => {
  let rulesPass = defaultResult;
  if (rules.length) {
    rulesPass = rules.some(rule => {
      if (rule.field && fieldsById.hasOwnProperty(rule.field)) {
        return evaluateRule(rule, fieldsById[rule.field].value);
      } else {
        return defaultResult;
      }
    });
  }
  return rulesPass;
};

export const processFields: ProcessFields = fields => {
  const fieldsById = mapFieldsById(fields);
  const updatedFields = fields.map(field => {
    const {
      visible,
      required,
      disabled,
      visibleWhen = [],
      requiredWhen = [],
      disabledWhen = []
    } = field;
    return Object.assign({}, field, {
      visible: evaluateAllRules(visibleWhen, fieldsById, visible !== false),
      required: evaluateAllRules(requiredWhen, fieldsById, !!required),
      disabled: evaluateAllRules(disabledWhen, fieldsById, !!disabled)
    });
  });
  return updatedFields;
};

export const processOptions: ProcessOptions = (fields, optionsHandler) => {
  return fields.map(field => {
    const { id } = field;
    const options = optionsHandler(id);
    if (options) {
      field.options = options;
    }
    return field;
  });
};

export const mapFieldsById: MapFieldsById = fields => {
  return fields.reduce((map, field) => {
    map[field.id] = field;
    return map;
  }, {});
};

export const createField: CreateFieldDef = field => {
  const {
    id = '',
    name = '',
    type = '',
    placeholder = '',
    value = undefined,
    visible = true,
    required = false,
    disabled = false,
    visibleWhen = [],
    requiredWhen = [],
    disabledWhen = [],
    validWhen = {},
    isValid = true,
    errorMessages = ''
  } = field;
  return {
    id,
    name,
    type,
    placeholder,
    value,
    visible,
    required,
    disabled,
    visibleWhen,
    requiredWhen,
    disabledWhen,
    isValid,
    validWhen,
    errorMessages
  };
};

// Because this function can be passed with the state of a component form
// it is not mutating the supplied fields array but returning a new instance
// each time, this is less efficient (when passing entire fieldDef arrays to the
// form) but safer when children of forms are registering themselves
export const registerField: RegisterField = (field, fields, formValue) => {
  if (fieldDefIsValid(field, fields)) {
    const { name, value, valueDelimiter } = field;
    field.defaultValue = formValue[name] || value;
    field.value = splitDelimitedValue(value, valueDelimiter);
    return fields.concat(field);
  }
  return fields.slice();
};

export const registerFields: RegisterFields = (fieldsToValidate, formValue) => {
  const fields = [];
  fieldsToValidate.forEach(field => {
    if (fieldDefIsValid(field, fields)) {
      const { name, value, valueDelimiter } = field;
      field.defaultValue = formValue[name] || value;
      field.value = splitDelimitedValue(value, valueDelimiter);
      fields.push(field);
    }
  });
  return fields;
};

export const updateFieldValue: UpdateFieldValue = (id, value, fields) => {
  const fieldsById = mapFieldsById(fields);
  const updateValue = typeof value !== 'undefined' && value;
  fieldsById[id].value = updateValue;
  return fields;
};

export const splitDelimitedValue: SplitDelimitedValue = (
  value,
  valueDelimiter
) => {
  if (valueDelimiter) {
    if (typeof value === 'string') {
      value = value.split(valueDelimiter);
    } else {
      value = [];
    }
  }
  return value;
};

export const joinDelimitedValue: JoinDelimitedValue = (
  value,
  valueDelimiter
) => {
  if (Array.isArray(value) && valueDelimiter) {
    value = value.join(valueDelimiter);
  }
  return value;
};

export const getMissingItems: GetMissingItems<Value> = (
  missingFrom,
  foundIn
) => {
  return foundIn.reduce((missingItems, item) => {
    !missingFrom.includes(item) && missingItems.push(item);
    return missingItems;
  }, []);
};

export const determineChangedValues: DetermineChangedValues = field => {
  const {
    name,
    defaultValue,
    value,
    valueDelimiter,
    addedSuffix = '_added',
    removedSuffix = '_removed'
  } = field;
  const outputValues = [];

  let initialValue = splitDelimitedValue(defaultValue, valueDelimiter);
  if (Array.isArray(initialValue) && Array.isArray(value)) {
    let added = getMissingItems(initialValue, value);
    let removed = getMissingItems(value, initialValue);

    added = joinDelimitedValue(added, valueDelimiter);
    removed = joinDelimitedValue(removed, valueDelimiter);

    outputValues.push(
      {
        name: name + addedSuffix,
        value: added
      },
      {
        name: name + removedSuffix,
        value: removed
      }
    );
  }
  return outputValues;
};

export const shouldOmitFieldValue: OmitFieldValue = field => {
  const { omitWhenHidden, omitWhenValueIs = [], visible, value } = field;
  return (
    (omitWhenHidden && !visible) ||
    (omitWhenValueIs.length !== 0 &&
      omitWhenValueIs.some(currValue => value === currValue))
  );
};

export const calculateFormValue: CalculateFormValue = fields => {
  return fields.reduce((formValue, field) => {
    const { name, value, useChangesAsValues } = field;
    if (shouldOmitFieldValue(field)) {
      return formValue;
    } else if (useChangesAsValues) {
      determineChangedValues(field).forEach(
        ({ name, value }) => (formValue[name] = value)
      );
    } else {
      // set(formValue, name, value);
      formValue[name] = value;
    }

    return formValue;
  }, {});
};
