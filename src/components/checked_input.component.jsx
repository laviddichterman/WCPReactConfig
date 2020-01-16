import React, { Component } from 'react';

export default class CheckedInput extends Component {
  static CheckForNumberGTZero(e) {
    const parsed = parseInt(e);
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  }

  constructor(props) {
    super(props);
    this.state = {
      local_value: this.props.value,
    };
  }

  onFinishChanging = () => {
    const new_val = this.props.InputCheckFunction(this.state.local_value);
    this.setState({local_value: new_val});
    this.props.onFinishChanging(new_val);
  }

  render() {
    return (
      <input
        type={this.props.type}
        className={this.props.className}
        value={this.state.local_value}
        onChange={(e) => this.setState({local_value:e.target.value})}
        onBlur={() => this.onFinishChanging()}
      />
    )
  }

}
