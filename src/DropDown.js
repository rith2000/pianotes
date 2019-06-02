import React from 'react';
import './global.js';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  getRest = () => {
    if(global.beat_count !== 0){ 
      //calculate number of beats left in measure in terms of base note
      let beat_per_measure = global.measureUpdated; //beats per measure
      let pos2 = beat_per_measure.lastIndexOf(":");
      beat_per_measure = parseInt(beat_per_measure.substring(pos2 + 1));
      let pos3 = global.measureUpdated.lastIndexOf("/");
      let beatvalue = parseInt(global.measureUpdated.substring(pos3 + 1));
      let pos4 = global.length.lastIndexOf("/");
      let basevalue = parseInt(global.length.substring(pos4+1));
      let beats_to_basenote = beatvalue/basevalue;
      let base_per_measure = beat_per_measure / beats_to_basenote;
      let result = beat_per_measure / beats_to_basenote - global.beat_count;

      return "z" + result;
    }
    return "";
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }


  onClick = (event) =>{
    let timeSig = event.target.innerText; 
    this.props.pause();
    global.notes += this.getRest() + '\n\\\nM: ' + timeSig + '\n';
    global.beat_count = 0;
    global.measureUpdated = 'M: ' + timeSig + '\n'

  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Time Signature
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick = {this.onClick}>4/4</DropdownItem>
          <DropdownItem onClick = {this.onClick}>3/4</DropdownItem>
          <DropdownItem onClick = {this.onClick}>2/4</DropdownItem>
          <DropdownItem onClick = {this.onClick}>6/8</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}