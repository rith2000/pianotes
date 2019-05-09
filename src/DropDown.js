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

  computeBeatsPerMeasure = () => {
      if(global.beat_count == 0){ 
      let beat_per_measure = global.measure; //beats per measure
      let pos2 = beat_per_measure.lastIndexOf(":");
      beat_per_measure = parseInt(beat_per_measure.substring(pos2 + 1));
      let pos3 = global.measure.lastIndexOf("/");
      let beatvalue = parseInt(global.measure.substring(pos3 + 1));
      let pos4 = global.length.lastIndexOf("/");
      let basevalue = parseInt(global.length.substring(pos4+1));
      let beats_to_basenote = beatvalue/basevalue;
      let base_per_measure = beat_per_measure / beats_to_basenote;
      return beat_per_measure / beats_to_basenote;
    }
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  //clean up functions??
  onClick44 = () => {
  	//global.measure = `M: 4/4
    //`;
    this.props.pause();
    global.notes += 'z' + (this.computeBeatsPerMeasure() - global.beat_count) + `\n\\\nM: 4/4
    `;
    global.measureUpdated = `M: 4/4
    `;
    console.log(this.computeBeatsPerMeasure() - global.beat_count)
  }
  onClick34 = () => {
  	//global.measure = `M: 3/4
    //`;
    this.props.pause();
    global.notes += 'z' + (this.computeBeatsPerMeasure() - global.beat_count) + `\n\\\nM: 3/4
    `;
    global.measureUpdated = `M: 3/4
    `;
    console.log(this.computeBeatsPerMeasure() - global.beat_count)
  }
  onClick24 = () => {
    this.props.pause();
  	global.notes += 'z' + (this.computeBeatsPerMeasure() - global.beat_count) + `\n\\\nM: 2/4
    `;
    global.measureUpdated = `M: 2/4
    `;
    console.log(this.computeBeatsPerMeasure() - global.beat_count)
  }
  onClick68 = () => {
    this.props.pause();
  	global.notes += 'z' + (this.computeBeatsPerMeasure() - global.beat_count) + `\n\\\nM: 6/8
    `;
    global.measureUpdated = `M: 6/8
    `;
    console.log(this.computeBeatsPerMeasure() - global.beat_count)
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