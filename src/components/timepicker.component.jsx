import React, { Component } from 'react';
import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const Group = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
);

export default class TimeSelection extends Component {
  static defaultProps = {
    optionCaption: "Time",
    isOptionDisabled: x => x.disabled,
  }
  render() {
    return (
      <Select
        options={[{
          label: this.props.optionCaption,
          options: this.props.options
        }]}
        className={this.props.className}
        formatGroupLabel={Group}
        onChange={this.props.onChange}
        value={this.props.value}
        isDisabled={this.props.disabled}
        isOptionDisabled={this.props.isOptionDisabled}
        />
    );
  };
}
