// @flow
import type {
  CreateFieldDef,
  FieldDef,
  FormState,
  EvaluateRule,
  EvaluateAllRules,
  MapFieldsById,
  OnChange,
  ProcessFields,
  RegisterFields,
  UpdateFieldValue,
  Value,
  ValidateField,
  ValidateAllFields
} from "./types";

// A field definition is valid if a field with the same id does not already exist in
// the supplied form state.
// We are assuming that typing takes care that all required attributes are present
const fieldDefIsValid = (field: FieldDef, state: FormState) => {
  const { fields } = state;
  return !fields.some(currentField => currentField.id === field.id);
};

const mapFieldDefToComponent = (field: FieldDef, onChange: OnChange) => {
  // The component onchange needs to be bound to the form onchange handler so that the form can process the value change
  // to manage the state of the form

  return null;
};

const valuesMatch = (a: Value, b: Value) => {
  if (a && b) {
    return a.toString() === b.toString();
  } else {
    return a === b;
  }
};

const evaluateRule: EvaluateRule = (rule = {}, targetValue) => {
  const { is = [], isNot = [] } = rule;
  let hasValidValue = is.length === 0;
  let hasInvalidValue = !!rule.isNot && rule.isNot.length > 0;

  if (hasInvalidValue) {
    hasInvalidValue = isNot.some(invalidValue =>
      valuesMatch(invalidValue, targetValue)
    );
  }

  if (!hasInvalidValue && !hasValidValue) {
    if (rule.is && rule.is.length) {
      hasValidValue = rule.is.some(validValue =>
        valuesMatch(validValue, targetValue)
      );
    }
  }
  return hasValidValue && !hasInvalidValue;
};

const evaluateAllRules: EvaluateAllRules = (
  rules = [],
  fieldsById = {},
  defaultResult = true
) => {
  let rulesPass = defaultResult;
  if (rules.length) {
    rulesPass = rules.some(rule => {
      if (rule.fieldId && fieldsById.hasOwnProperty(rule.fieldId)) {
        return evaluateRule(rule, fieldsById[rule.fieldId].value);
      } else {
        return defaultResult;
      }
    });
  }
  return rulesPass;
};

const processFields: ProcessFields = fields => {
  const fieldsById = mapFieldsById(fields);
  const updatedFields = fields.map(field => {
    const {
      visible,
      required,
      disabled,
      visibleWhen,
      requiredWhen,
      disabledWhen
    } = field;
    return Object.assign({}, field, {
      visible: evaluateAllRules(visibleWhen, fieldsById, visible !== false),
      required: evaluateAllRules(requiredWhen, fieldsById, !!required),
      disabled: evaluateAllRules(disabledWhen, fieldsById, !!disabled)
    });
  });
  return updatedFields;
};

const mapFieldsById: MapFieldsById = fields => {
  return fields.reduce((map, field) => {
    map[field.id] = field;
    return map;
  }, {});
};

const validators = {
  lengthIsGreaterThan: function({ value, length, message }) {
    if (isNaN(length) || (value || "").length > length) {
      return;
    } else {
      return message || `Should have more than ${length} characters`;
    }
  }
};

const validateField: ValidateField = field => {
  const { required, visible, value, validWhen } = field;
  let isValid = true;
  let errorMessages = [];
  if (visible) {
    if (required) {
      const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
      isValid = (value || value === 0 || value === false) && !valueIsEmptyArray;
    }

    isValid =
      Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
        if (typeof validators[validator] === "function") {
          let validationConfig = validWhen[validator];
          validationConfig.value = value;
          let message = validators[validator](validationConfig);
          if (message) {
            allValidatorsPass = false;
            errorMessages.push(message);
          }
        } else {
          console.warn("The requested validator does not exist", validator);
        }
        return allValidatorsPass;
      }, isValid) && isValid;
  }
  return Object.assign({}, field, {
    isValid,
    errorMessages: errorMessages.join(", ")
  });
};

const validateAllFields: ValidateAllFields = fields => {
  const validatedFields = fields.map(field => validateField(field));
  return validatedFields;
};

const createField: CreateFieldDef = field => {
  const {
    id = "",
    name = "",
    type = "",
    placeholder = "",
    value = undefined,
    visible = true,
    required = false,
    disabled = false,
    visibleWhen = [],
    requiredWhen = [],
    disabledWhen = [],
    validWhen = {},
    isValid = true,
    errorMessages = ""
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

const registerFields: RegisterFields = fieldsToValidate => {
  const fields = [];
  const state: FormState = { fields };
  fieldsToValidate.forEach(field => {
    if (fieldDefIsValid(field, state)) {
      fields.push(field);
    }
  });
  return fields;
};

const updateFieldValue: UpdateFieldValue = (id, value, fields) => {
  const fieldsById = mapFieldsById(fields);

  const updateValue = typeof value !== "undefined" && value;
  fieldsById[id].value = updateValue;

  fields = processFields(fields);
  fields = validateAllFields(fields);
  // const isValid = fields.every(field => field.isValid);
  // const value = generateFormValue({ fields });

  // fieldsById = mapFieldsById({ fields });

  return fields;
};

export {
  createField,
  evaluateRule,
  evaluateAllRules,
  fieldDefIsValid,
  mapFieldsById,
  mapFieldDefToComponent,
  processFields,
  registerFields,
  updateFieldValue,
  valuesMatch,
  validateField,
  validateAllFields
};
