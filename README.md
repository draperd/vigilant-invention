This is a work-in-progress forms library for use with React. It builds upon ideas that can be found in [Aikau](https://github.com/Alfresco/Aikau) and [studious-fiesta](https://github.com/draperd/studious-fiesta) for defining forms through declaration. 

It is intended to be used with any library that provides form fields but currently provides examples with [Atlaskit](https://atlaskit.atlassian.com/) and native HTML form elements. In theory it should be possible to write additional renderers for other librarys - i.e. for Bootstrap or Material Design forms, etc. 

This implementation makes use of the new context API introduced in React 16.3 to solve a number of hard to solve problems:

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

