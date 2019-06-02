import React, { Component } from 'react';
import './Metronome.css';
// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const lookAhead = 25.0;
const scheduleAheadTime = 0.1; 
const noteLength = .05; 
//const beatsPerMeasure = {this.props.beatsMeasure}; 

class Metronome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPlaying: false,
			count: 0,
			bpm: 100,
			beatsPerMeasure: 4,
			beat: 0,
			nextNoteTime: 0.0,
		};
	}
	
	handleBpmChange = event => {
		const bpm = event.target.value;
		const beatsPerMeas = 
		this.setState({bpm: bpm}); 
		
		//global.metronome = `Q:1/4=${bpm}`; 
		//console.log("bpm: " + bpm);

		//this.setState({bpm});
		global.metronome = `Q:1/4=${bpm}
		`; 
		console.log(global.metronome);
		
	}

	scheduler = () => {
    if(this.state.isPlaying === true) {
    	this.setState({isPlaying: false});
    	clearInterval(this.timer);
    	return;
    }
    else {
    	this.setState({isPlaying: true}, function() {
    		this.timer = setInterval(this.start, lookAhead);
    	});
    }
	}

	start = () => {
		if (this.state.nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        	this.scheduleNote();
        	this.nextNote();
    	}
	}

	nextNote = () => {
	    var secondsPerBeat = 60.0 / this.state.bpm;    
	    secondsPerBeat += this.state.nextNoteTime;
	 	this.setState({nextNoteTime: secondsPerBeat});
	    var currentquarter = this.state.beat + 1;
	    this.setState({beat: currentquarter});   
	    if (this.state.beat === this.state.beatsPerMeasure) {
	        this.setState({beat: 0});
	    }
	}
	
	scheduleNote = () => {
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
 
    if(this.state.beat % this.state.beatsPerMeasure === 0) {
    	osc.frequency.value = 880;
    }
    else {
    	osc.frequency.value = 220.0;
    }
    osc.start( this.state.nextNoteTime );
    osc.stop( this.state.nextNoteTime + noteLength); 
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
			<button className= "btn" onClick={this.scheduler}>{this.state.isPlaying ? 'Stop Metronome' : 'Play Metronome'}</button>
		</div>
	}
}

export default Metronome;