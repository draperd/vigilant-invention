import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Form from "./forms/components/Form";
import { createField } from "./forms/components/utils";
import type { FieldDef } from "./forms/components/types";

const fields: FieldDef[] = [
  createField({
    id: "NAME",
    name: "name",
    value: "bob",
    type: "text",
    required: true
  }),
  createField({
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
  }),
  createField({
    id: "AGE",
    name: "age",
    value: 18,
    type: "number"
  }),
  createField({ id: "SHOW", name: "show", value: true, type: "checkbox" })
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Form fields={fields} />
      </div>
    );
  }
}

export default App;
