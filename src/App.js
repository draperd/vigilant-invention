import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Form from "./forms/components/Form";
import { createField } from "./forms/components/utils";
import type { FieldDef } from "./forms/components/types";

const fields: FieldDef[] = [
  {
    id: "NAME",
    name: "name",
    value: "bob",
    type: "text",
    required: true
  },
  {
    id: "NAME2",
    name: "name",
    placeholder: "Enter name...",
    value: "",
    required: true,
    visibleWhen: [
      {
        fieldId: "NAME",
        isNot: ["hide"]
      }
    ],
    disabledWhen: [
      {
        fieldId: "NAME",
        is: ["lock"]
      }
    ]
  },
  {
    id: "AGE",
    name: "age",
    value: 18,
    type: "number",
    visibleWhen: [
      {
        fieldId: "SHOW",
        isNot: [false]
      }
    ]
  },
  { id: "SHOW", name: "show", value: true, type: "checkbox" }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIsDisabled: false,
      formValue: {}
    };
  }
  render() {
    const { buttonIsDisabled, formValue } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Form
          fields={fields}
          vale={formValue}
          onChange={(formValue, isValid) =>
            this.setState({ formValue, buttonIsDisabled: !isValid })
          }
        />
        <button
          disabled={buttonIsDisabled}
          onClick={() => console.log("Form value is", formValue)}
        >
          OK
        </button>
      </div>
    );
  }
}

export default App;
