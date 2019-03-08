import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      timesignature: '4/4',
      defaultnotelength: '1/4'
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  onClick44 = () => {
  	this.setState({timesignature: '4/4'});
  	this.setState({defaultnotelength: '1/4'});
  }
  onClick34 = () => {
  	this.setState({timesignature: '3/4'});
  	this.setState({defaultnotelength: '1/4'});
  }
  onClick24 = () => {
  	this.setState({timesignature: '2/4'});
  	this.setState({defaultnotelength: '1/4'});
  }
  onClick68 = () => {
  	this.setState({timesignature: '6/8'});
  	this.setState({defaultnotelength: '1/8'});
  }
  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Time Signature
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick = {this.onClick44}>4/4</DropdownItem>
          <DropdownItem onClick = {this.onClick34}>3/4</DropdownItem>
          <DropdownItem onClick = {this.onClick24}>2/4</DropdownItem>
          <DropdownItem onClick = {this.onClick68}>6/8</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}