// @flow
import {
  calculateFormValue,
  createField,
  evaluateRule,
  evaluateAllRules,
  fieldDefIsValid,
  mapFieldsById,
  shouldOmitFieldValue,
  processFields,
  registerFields,
  updateFieldValue,
  validateField
} from "./utils";
import type { FieldDef, FormState } from "./types";

const field1 = createField({
  id: "one",
  name: "name",
  value: "value"
});

describe("registerFields", () => {
  const field1 = createField({
    id: "a",
    name: "a",
    type: "text"
  });
  const field2 = createField({
    id: "b",
    name: "b",
    type: "text"
  });
  const field3 = createField({
    id: "a",
    name: "c",
    type: "text"
  });

  const fields = [field1, field2, field3];

  test("fields with duplicate IDs are filtered out", () => {
    const registeredFields = registerFields(fields);
    expect(registeredFields.length).toEqual(2);
    expect(registeredFields[0].id).toEqual("a");
    expect(registeredFields[1].id).toEqual("b");
  });
});

describe("fieldDefIsValid", () => {
  it("field is valid when the form does not contain a field with the same id", () => {
    expect(fieldDefIsValid(field1, [])).toEqual(true);
  });

  test("field is not valid when form already contains a field with the same id", () => {
    expect(fieldDefIsValid(field1, [field1])).toEqual(false);
  });
});

describe("evaluateRule", () => {
  test("evaluting a rule with no arguments", () => {
    expect(evaluateRule()).toEqual(true);
  });

  test("successful 'is' rule", () => {
    expect(
      evaluateRule({
        fieldId: "one",
        rule: { is: [true] },
        targetValue: true
      })
    ).toEqual(true);
  });

  test("failing 'is' rule", () => {
    expect(evaluateRule({ fieldId: "one", is: [false] }, true)).toEqual(false);
  });

  test("successful 'isNot' rule", () => {
    expect(evaluateRule({ fieldId: "one", isNot: [true] }, true)).toEqual(
      false
    );
  });

  test("failing 'isNot' rule", () => {
    expect(evaluateRule({ fieldId: "one", isNot: [false] }, true)).toEqual(
      true
    );
  });

  test("successful combined 'is' and isNot' rule", () => {
    expect(
      evaluateRule({ fieldId: "onee", is: [true], isNot: [false] }, true)
    ).toEqual(true);
  });

  test("failing combined 'is' and isNot' rule", () => {
    expect(
      evaluateRule({ fieldId: "one", is: [true], isNot: [false] }, false)
    ).toEqual(false);
  });
});

// describe("evaluateAllRules", () => {
//   test("evaluating no rules returns the default default", () => {
//     expect(evaluateAllRules()).toEqual(true);
//   });
// });

describe("validateField", () => {
  test("visible, optional field is always valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: false
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test("visible, required field with empty string value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: ""
    };
    expect(validateField(testField).isValid).toBe(false);
  });

  test("visible, required field with numberical value 0 is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: 0
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test("visible, required field with false value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: false
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test("visible, required field with string value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: "test"
    };
    expect(validateField(testField).isValid).toBe(true);
  });

  test("visible, required field with empty array value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: []
    };
    expect(validateField(testField).isValid).toBe(false);
  });

  test("visible, required field with populated array value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: [1]
    };
    expect(validateField(testField).isValid).toBe(true);
  });
});

describe("processFields", () => {
  const triggerField = createField({
    id: "triggerField",
    name: "triggerField",
    value: "test"
  });
  const shouldBeVisible = createField({
    id: "shouldBeVisible",
    name: "shouldBeVisible",
    visibleWhen: [{ fieldId: "triggerField", is: ["test"] }]
  });
  const shouldBeHidden = createField({
    id: "shouldBeHidden",
    name: "shouldBeHidden",
    visibleWhen: [{ fieldId: "triggerField", isNot: ["test"] }]
  });
  const shouldBeRequired = createField({
    id: "shouldBeRequired",
    name: "shouldBeRequired",
    requiredWhen: [{ fieldId: "triggerField", is: ["test"] }]
  });
  const shouldBeOptional = createField({
    id: "shouldBeOptional",
    name: "shouldBeOptional",
    requiredWhen: [{ fieldId: "triggerField", isNot: ["test"] }]
  });
  const shouldBeDisabled = createField({
    id: "shouldBeDisabled",
    name: "shouldBeDisabled",
    disabledWhen: [{ fieldId: "triggerField", is: ["test"] }]
  });
  const shouldBeEnabled = createField({
    id: "shouldBeEnabled",
    name: "shouldBeEnabled",
    disabledWhen: [{ fieldId: "triggerField", isNot: ["test"] }]
  });

  const fields = [
    triggerField,
    shouldBeVisible,
    shouldBeHidden,
    shouldBeRequired,
    shouldBeOptional,
    shouldBeDisabled,
    shouldBeEnabled
  ];

  const processedFields = processFields(fields);
  const processedFieldsById = mapFieldsById(processedFields);

  test("field should be visible", () => {
    expect(processedFieldsById.shouldBeVisible.visible).toBe(true);
  });
  test("field should be hidden", () => {
    expect(processedFieldsById.shouldBeHidden.visible).toBe(false);
  });
  test("field should be required", () => {
    expect(processedFieldsById.shouldBeRequired.required).toBe(true);
  });
  test("field should be optional", () => {
    expect(processedFieldsById.shouldBeOptional.required).toBe(false);
  });
  test("field should be disabled", () => {
    expect(processedFieldsById.shouldBeDisabled.disabled).toBe(true);
  });
  test("field should be enabled", () => {
    expect(processedFieldsById.shouldBeEnabled.disabled).toBe(false);
  });
});

describe("shouldOmitFieldValue", () => {
  const baseField: FieldDef = {
    id: "TEST",
    value: "foo",
    name: "test",
    type: "text"
  };
  test("value should be omitted when hidden", () => {
    const field = { ...baseField, omitWhenHidden: true, visible: false };
    expect(shouldOmitFieldValue(field)).toEqual(true);
  });
  test("value should be included when visible", () => {
    const field = { ...baseField, omitWhenHidden: true, visible: true };
    expect(shouldOmitFieldValue(field)).toEqual(false);
  });
  test("value should be ommitted when value matches", () => {
    const field = { ...baseField, omitWhenValueIs: ["foo"] };
    expect(shouldOmitFieldValue(field)).toEqual(true);
  });
  test("value should be included when value does not match", () => {
    const field = { ...baseField, omitWhenValueIs: ["wrong"] };
    expect(shouldOmitFieldValue(field)).toEqual(false);
  });
});

describe("calculateFormValue", () => {
  const baseField: FieldDef = {
    id: "TEST",
    value: "foo",
    name: "test",
    type: "text"
  };
  const field1 = { ...baseField, omitWhenHidden: true, visible: false };
  const field2 = { ...baseField, id: "TEST2", name: "test2", value: "bar" };
  const field3 = { ...baseField, id: "TEST3", name: "test3", value: "bob" };
  const field4 = { ...baseField, id: "TEST4", name: "test3", value: "ted" };

  const value = calculateFormValue([field1, field2, field3, field4]);
  test("two field values should be omitted", () => {
    expect(Object.keys(value).length).toEqual(2);
  });
  test("hidden field value should not be included", () => {
    expect(value.test).not.toBeDefined();
  });
  test("normal value should be included", () => {
    expect(value.test2).toEqual("bar");
  });
  test("last field wins", () => {
    expect(value.test3).toEqual("ted");
  });
});

describe("updateFieldValue", () => {
  const field1 = { id: "A", name: "a", type: "text", value: "baa" };
  const field2 = { id: "B", name: "b", type: "text", value: "moo" };
  const field3 = { id: "C", name: "c", type: "text", value: "woof" };

  const fields = updateFieldValue("B", "oink", [field1, field2, field3]);
  const fieldsById = mapFieldsById(fields);

  test("field is updated with new value", () => {
    expect(fieldsById.B.value).toEqual("oink");
  });
});
