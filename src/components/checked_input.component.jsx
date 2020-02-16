import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';


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
      <TextField
        label={this.props.label}
        type={this.props.type}
        className={this.props.className}
        value={this.state.local_value}
        size="small"
        onChange={(e) => this.setState({local_value:e.target.value})}
        onBlur={() => this.onFinishChanging()}
      />
    )
  }

}
