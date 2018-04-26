// @flow
import {
  validateField,
  lengthIsGreaterThan,
  lengthIsLessThan
} from './validation';
import { createField } from '../components/utils.js';
import type { ValidateField, ValidateAllFields } from '../components/types';

const field1 = createField({
  id: 'one',
  name: 'name',
  value: 'value'
});

describe('validateField', () => {
  test('visible, optional field is always valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: false
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test('visible, required field with empty string value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: ''
    };
    expect(validateField(testField).isValid).toBe(false);
  });

  test('visible, required field with numberical value 0 is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: 0
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test('visible, required field with false value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: false
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test('visible, required field with string value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: 'test'
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test('visible, required field with empty array value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: []
    };
    expect(validateField(testField).isValid).toBe(false);
  });

  test('visible, required field with populated array value is valid', () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: [1]
    };
    expect(validateField(testField).isValid).toBe(true);
  });
});

describe('lengthIsGreaterThan validator', () => {
  test('with valid value', () => {
    expect(
      lengthIsGreaterThan({
        value: 'test',
        length: 3,
        message: 'Fail'
      })
    ).toBeUndefined();
  });

  test('with invvalid value', () => {
    expect(
      lengthIsGreaterThan({
        value: 'te',
        length: 3,
        message: 'Fail'
      })
    ).toBe('Fail');
  });
});

describe('lengthIsLessThan validator', () => {
  test('with valid value', () => {
    expect(
      lengthIsLessThan({
        value: 'te',
        length: 3,
        message: 'Fail'
      })
    ).toBeUndefined();
  });

  test('with invvalid value', () => {
    expect(
      lengthIsLessThan({
        value: 'test',
        length: 3,
        message: 'Fail'
      })
    ).toBe('Fail');
  });
});
