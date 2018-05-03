## What is this?
This is a work-in-progress forms library for use with React. It provides a way of building forms through declaration rather than coding. 

## What's with the name?
GitHub suggested it when I created the repository. I'm no better at naming things. It'll do for now.

## Why is this better than any of the other forms libraries that are available?
To be honest I don't know - I've not actually taken a look at what else is available. I've been working on various implementations of the ideas in this project for over 10 years in a variety of different JavaScript frameworks... let me know if there are better options available and I'll do something else with my time. Maybe I'll take up golf.

## Is this ready to use in my project?
Not really. At the moment I'm just looking for feedback and validation on the approach, but hopefully soon I'll make some updates that make it easy for people to pull into their own projects and use.

The code currently lives within an application built using create-react-app. The best way to evaluate this is to clone/fork the project and run `yarn install` then `yarn start` to see it in action.

* Example form definitions can be found [here](https://github.com/draperd/vigilant-invention/blob/master/src/examples/definitions.js).
* The app layout can be found [here](https://github.com/draperd/vigilant-invention/blob/master/src/examples/App.js).

## What problems are you trying to solve?

#### Declarative
Make it easy to build forms with fields that have complex relationships through a simple, consistent, declarative specification.

#### Work with different field libraries
It is intended to be used with any library that provides form fields but currently provides examples with [Atlaskit](https://atlaskit.atlassian.com/) and native HTML form elements. In theory it should be possible to write additional renderers for other librarys - i.e. for Bootstrap or Material Design forms, etc.

#### Support complex layouts
By allowing forms to be defined as a combination of fragment components (or even individual field components) it is possible to construct complex layouts (e.g. fields split between tabs or in collapsible sections, etc). Buttons that respond to the form state can be placed anywhere within the context of the form. It also provides HTML attributes to allow CSS selectors to customize the field layouts.

## Requirements
This implementation makes use of the new context API recently added to React **so you need to use at least React 16.3**.

## More Info

* Entire forms can be defined as simple JSON structures
* Forms can be defined as multiple fragments of JSON to allow complex layouts (such as a single form split across tabs or collapsing sections)
* Forms can be defined using individual field components for full layout control

Form definitions support:
* labels
* descriptions
* placeholder text
* default values
* validation rules (min/max length, numerical range, regex pattern matching)
* visibility rules (based on values of one or more other fields)
* requirement rules (based on values of one or more other fields)
* disablment rules (based on values of one or more other fields)
* static options
* dynamic options
* rules defining when the value of the field should be included in the form value

...and there will be more capabilities yet to be added

## Examples

#### Field Definition
You can define fields using the following structure:

```JAVASCRIPT
const fields = [
  {
    id: 'TEAMNAME',
    type: 'text',
    name: 'name',
    label: 'Team name',
    required: true,
    trimValue: true,
    validWhen: {
      lengthIsLessThan: {
        length: 256,
        message: 'Team names can be a maximum of 255 characters in length'
      }
    }
  },
 ]
 ```
 
 The current set of attributes you can use are:
 
 * id - A unique ID for the field
 * name - The attribute that the field value will be assigned to (can be shared by multiple fields)
 * type - The type of field (renderers use this to map the field to a specific field component)
 * defaultValue - An initial value for the field
 * label - The label for the field
 * description - A description of the field (i.e. for tooltips)
 * placeholder - Placeholder text for fields that support it
 * required - If a value for the field must be provided
 * visible - Whether or not the field can be seen
 * disabled - Whether or not the field is disabled
 * trimValue - Whether or not leading and trailing whitespace should be trimmed from the value
 * visibleWhen - Rules that define when the field should be visible
 * requiredWhen - Rules that define when a value for the field must be provided
 * disabledWhen - Rules that define when the field is disabled
 * options - A static list of options for fields that support options (dynamic options can be provided through a function handler passed as a property to the form)
 * omitWhenHidden - Indicates whether the field value should be included in the form value when the field is hidden
 * omitWhenValueIs - Possible values of the field that should not be included in the form value
 * useChangesAsValues - When multiple options can be set as values this will set the changes as values rather than the final list of options
 * valueDelimiter - When multiple options can be set as values this will convert the array into a string delimited by this value
 * addedSuffix - When using changes as values, this string will be appended to the `name` for the values added
 * removedSuffix - When using changes as values, this string will be appended to the `name` for the values removed
 * misc - Any else
 
 You can then pass the definition directly into a Form component
 
 ```JSX
 <Form defaultFields={fields} />
 ```
 
 ...or you can build forms from multiple fragments
 
 ```JSX
 <Form>
   <FormFragment defaultFields={fields1} />
   <FormFragment defaultFields={fields2} />
 </Form>
 ```
 
 ...or you can build forms from individual components
 
 ```JSX
 <Form>
  <FieldText
    id="NAME"
    name="name"
    placeholder="Who are you?"
    value=""
    label="Name"
    description="Tell me a bit about yourself"
    required={true}
    visibleWhen={[{ field: 'SHOW', is: ['YES'] }]}
  />
</Form>
```
  
#### Field rendering
You can provide out-of-the-box or custom renderers and option handlers for your fields directly to the form (these will be used for all definitions in forms or fragements)
  
```JSX
<Form
  defaultFields={fields}
  optionsHandler={myOptionsHandler}
  renderField={atlaskitFieldRenderer}
>
```

#### Buttons
You can place buttons anywhere within the form (allowing complex layouts) where the button will have access to the current form value.

```JSX
<Form
  defaultFields={fields}
  optionsHandler={optionHandler}
  renderField={nativeFieldRenderer}
>
  <FormButton
    onClick={(value) =>
      console.log('Definition button value', value)
    }
  />
</Form>
```
  
  
 
 

