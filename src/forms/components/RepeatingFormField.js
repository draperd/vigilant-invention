// @flow
import React, { Component, PureComponent } from 'react';
import Form from './Form';
import renderField from './AtlasKitFields';
import type { FieldDef } from './types';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { formBuilder } from '../../definitions';
import './RepeatingFormField.css';

type ChevronProps = {
  isExpanded: boolean,
  //   ariaControls: string,
  onExpandToggle?: Function
};

type ChevronState = {
  isFocused: boolean,
  isHovered: boolean
};

class Chevron extends PureComponent<ChevronProps, ChevronState> {
  state: ChevronState = {
    isFocused: false,
    isHovered: false
  };

  handleClick = () => {
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  handleMouseOver = () => {
    this.setState({ isHovered: true });
  };

  handleMouseOut = () => {
    this.setState({ isHovered: false });
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { isExpanded /*ariaControls*/ } = this.props;
    const { isFocused, isHovered } = this.state;
    const iconProps = {
      size: 'medium'
      //   primaryColor: isHovered || isFocused ? iconColorFocus : iconColor
    };
    return (
      <span>
        <button
          type={'button'}
          //   aria-controls={ariaControls}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          {isExpanded ? (
            <ChevronDownIcon label="Collapse" {...iconProps} />
          ) : (
            <ChevronRightIcon label="Expand" {...iconProps} />
          )}
        </button>
      </span>
    );
  }
}

type ExpanderProps = {
  label: string,
  remove: () => void,
  children: any
};

type ExpanderState = {
  isExpanded: boolean
};

class Expander extends Component<ExpanderProps, ExpanderState> {
  state: ExpanderState = {
    isExpanded: false
  };

  render() {
    const { isExpanded } = this.state;
    const { children, label, remove } = this.props;

    return (
      <div className="expander">
        <Chevron
          key="chevron"
          isExpanded={isExpanded}
          onExpandToggle={() =>
            this.setState(prevState => ({
              isExpanded: !prevState.isExpanded
            }))
          }
        />
        <span className="label">{label}</span>
        <CrossCircleIcon onClick={remove} />
        <div
          className="content"
          style={{ display: isExpanded ? 'block' : 'none' }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

type Props = {};

type State = {
  previewFields: FieldDef[],
  builderFields: Array<any>,
  isExpanded: boolean
};

export default class RepeatingFormField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      previewFields: [],
      builderFields: [],
      isExpanded: false
    };
  }

  addField() {
    const { builderFields } = this.state;
    const targetIndex = builderFields.length;
    builderFields[targetIndex] = (
      <Form
        key={targetIndex}
        fields={formBuilder}
        renderField={renderField}
        onChange={(value, isValid) => {
          const { previewFields } = this.state;
          previewFields[targetIndex] = value;
          this.setState({
            previewFields
          });
        }}
      />
    );
    this.setState({ builderFields });
  }

  removeField(index: number) {
    const { builderFields, previewFields } = this.state;
    this.setState({
      previewFields: previewFields.filter((f, i) => index !== i),
      builderFields: builderFields.filter((f, i) => index !== i)
    });
  }

  render() {
    const { previewFields, builderFields, isExpanded } = this.state;

    const builders = builderFields.map((builder, index) => {
      const label =
        (previewFields[index] && previewFields[index].id) ||
        'Unidentified field';
      return (
        <Expander
          key={`exp_${index}`}
          label={label}
          remove={() => {
            this.removeField(index);
          }}
        >
          {builder}
        </Expander>
      );
    });

    return (
      <div className="App">
        <section>
          <div>Builder</div>
          <div>{builders}</div>
          <Button onClick={() => this.addField()}>Add Field</Button>
        </section>
        <section>
          <div>Preview</div>
          <Form fields={previewFields.slice()} renderField={renderField} />
        </section>
      </div>
    );
  }
}
