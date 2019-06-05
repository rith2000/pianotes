import React, { Component } from 'react';
import './Metronome.css';
// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const lookAhead = 25.0;
const scheduleAheadTime = 0.1; 
const noteLength = .05; 
//const beatsPerMeasure = {this.props.beatsMeasure}; 


	
//let beat_per_measure = 0;

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
		
		this.setState({bpm: bpm}); 
		//this.setState({beatsPerMeasure: beat_per_measure});
		//console.log("bPMeasure:" + this.state.beatsPerMeasure);
	
		global.metronome = `Q:1/4=${bpm}
		`; 
		
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

	var beat_per_measure = global.measureUpdated; //beats per measure
    var pos2 = beat_per_measure.lastIndexOf(":");
    beat_per_measure = parseInt(beat_per_measure.substring(pos2 + 1));

    var pos3 = global.measureUpdated.lastIndexOf("/");
    var beatvalue = parseInt(global.measureUpdated.substring(pos3 + 1));
    //console.log(beatvalue);

    var pos4 = global.length.lastIndexOf("/");
    var basevalue = parseInt(global.length.substring(pos4+1));
    //ie. 16th, 32nd note as the shortest possible note
    //all note durations are added in terms of the base note duration
    //console.log(basevalue);

    var pos = global.metronome.lastIndexOf("=");
    var tempo = parseInt(global.metronome.substring(pos+1));
    var beats_to_basenote = beatvalue/basevalue;
    var seconds_per_basenote = 60/ tempo * beats_to_basenote; //std to 60, where 1q = 1s, 
    //this assumes the beat is a quarter... fix!
    // console.log("beat per measure" + beat_per_measure);

    var base_per_measure = beat_per_measure / beats_to_basenote;

    this.setState({beatsPerMeasure: beat_per_measure});



	    var secondsPerBeat = 60.0 / this.state.bpm;    
	    secondsPerBeat += this.state.nextNoteTime;
	 	this.setState({nextNoteTime: secondsPerBeat });
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
    osc.start( this.state.nextNoteTime);
    osc.stop( this.state.nextNoteTime + noteLength); 
	}

	render() {
		console.log("bPM:" + this.state.beatsPerMeasure);
		console.log("BPM:" + this.state.bpm);
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