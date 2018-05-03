## What is this?
This is a work-in-progress forms library for use with React. It builds upon ideas that can be found in [Aikau](https://github.com/Alfresco/Aikau) and [studious-fiesta](https://github.com/draperd/studious-fiesta) for defining forms through declaration. 

## Why is this better than any of the other forms libraries that are available?
To be honest I don't know - I've not actually taken a look at what else is available. I've been working on various implementations of the ideas in this project for over 10 years in a variety of different JavaScript frameworks. 

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

**This project isn't ready to be used yet - at the moment I'm just looking for feedback and validation on the approach.**

The code currently lives within an application built using create-react-app. The best way to evaluate this is to clone/fork the project and run `yarn install` then `yarn start` to see it in action.

Example form definitions can be found [here](https://github.com/draperd/vigilant-invention/blob/master/src/examples/definitions.js).

The app layout can be found [here](https://github.com/draperd/vigilant-invention/blob/master/src/examples/App.js).

But for a brief summary...

**Field Definition**
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
  
**Field rendering**
You can provide out-of-the-box or custom renderers and option handlers for your fields directly to the form (these will be used for all definitions in forms or fragements)
  
```JSX
<Form
  defaultFields={fields}
  optionsHandler={myOptionsHandler}
  renderField={atlaskitFieldRenderer}
>
```

**Buttons**
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
  
  
 
 

