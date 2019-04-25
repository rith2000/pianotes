import React, { Component } from 'react';
import './global.js';
import './Metronome.css'

class Slider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bpm: 100,
		};
	}
	handleBpmChange = event => {
		const bpm = event.target.value;
		this.setState({bpm});
		global.metronome = `Q:1/4=${bpm}
		`; 
		console.log(global.metronome);
	}
	render() {
		return <div className = "metronome"> 
			<div className ="bpm-slider">
				<div>{this.state.bpm} BPM</div>
				<input 
					type = "range" 
					min = "60" 
					max = "240" 
					value={this.state.bpm}
					onChange={this.handleBpmChange}/>
			</div>
		</div>
	}
}

export default Slider;
