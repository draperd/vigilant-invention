// @flow
import type { ValidateField, ValidateAllFields } from '../components/types';

export const validators = {
  lengthIsGreaterThan: function({ value, length, message }) {
    if (isNaN(length) || (value || '').length > length) {
      return;
    } else {
      return message || `Should have more than ${length} characters`;
    }
  }
};

export const validateField: ValidateField = field => {
  const { required, visible, value, validWhen = {} } = field;
  let isValid = true;
  let errorMessages = [];
  if (visible) {
    if (required) {
      const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
      isValid = (value || value === 0 || value === false) && !valueIsEmptyArray;
    }

    isValid =
      Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
        if (typeof validators[validator] === 'function') {
          let validationConfig = validWhen[validator];
          validationConfig.value = value;
          let message = validators[validator](validationConfig);
          if (message) {
            allValidatorsPass = false;
            errorMessages.push(message);
          }
        } else {
          console.warn('The requested validator does not exist', validator);
        }
        return allValidatorsPass;
      }, isValid) && isValid;
  }
  return Object.assign({}, field, {
    isValid,
    errorMessages: errorMessages.join(', ')
  });
};

export const validateAllFields: ValidateAllFields = fields => {
  const validatedFields = fields.map(field => validateField(field));
  return validatedFields;
};
