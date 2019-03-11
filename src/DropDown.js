import React from 'react';
import './global.js';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  onClick44 = () => {
  	global.measure = `M: 4/4
    `;

  }
  onClick34 = () => {
  	global.measure = `M: 3/4
    `;
    console.log(global.measure);
  }
  onClick24 = () => {
  	global.measure = `M: 2/4
    `;
  }
  onClick68 = () => {
  	global.measure =  `M: 6/8
    `;
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