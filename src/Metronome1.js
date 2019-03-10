import React, { Component } from 'react';
//import click1 from './Tock.mp3';
//import click2 from './Tick.mp3';
import DropDown from './DropDown.js';
import './global.js';
//import './metronomeworker.js'; //?

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//var currentTime = audioContext.currentTime; //?

const lookAhead = 25.0;
var startTime;
const scheduleAheadTime = 0.1; 
const noteLength = 0.05; 
var timerWorker = null;     // The Web Worker used to fire timer messages

class Metronome extends Component {
	constructor(props) {
		super(props);
		//this.click1 = new Audio(click1);
		//this.click2 = new Audio(click2);
		this.state = {
			isPlaying: false,
			count: 0,
			bpm: 100,
			beatsPerMeasure: 4,
			beat: 0,
			nextNoteTime: 0.0,
			notesinQueue: [],
		};
	}
	handleBpmChange = event => {
		const bpm = event.target.value;
		this.setState({bpm});
		global.metronome = 'Q:1/4=' + bpm; //check
		//console.log(global.metronome);
	}
	/*startStop = () => { //change
		if(this.state.isPlaying) {
			clearInterval(this.timer);
			this.setState({
				isPlaying: false
			});
		} else {
			this.timer = setInterval(
				this.playClick,
				(60 / this.state.bpm * 1000)
			);
			this.setState(
			{
				count: 0,
				isPlaying: true
			},
			this.playClick
			);
		}
	}
	playClick = () => {
		const { count, beatsPerMeasure} = this.state;
		if(count % beatsPerMeasure === 0) {
			this.click2.play();
		}
		else {
			this.click1.play();
		}
		this.setState(state => ({
			count: (state.count + 1) % state.beatsPerMeasure
		}));
	};*/

	test = () => {
		/*
		const val = this.state.nextNoteTime;
		var oscil = audioContext.createOscillator();
		oscil.connect(audioContext.destination);
		oscil.start(val);
		oscil.stop(val + 0.05);
		var osc = audioContext.createOscillator();
		osc.connect(audioContext.destination);
		osc.start(val + 0.1);
		osc.stop(val + 0.) */
		if(this.state.isPlaying) {
			this.setState({isPlaying: false});
			return;
		}
		else {
			var oscil = audioContext.createOscillator();
			oscil.connect( audioContext.destination );
			this.setState({isPlaying: true});
			while(this.state.isPlaying) {
				const time = this.state.nextNoteTime;
				oscil.start(time);
				oscil.stop(time + 0.05);
				var increment = this.state.newNoteTime + 4;
				this.setState({nextNoteTime: increment});
			}
		}
	}

	scheduler = () => {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    if(this.state.isPlaying === true) {
    	this.setState({isPlaying: false});
    	return;
    }
    else {
    	this.setState({isPlaying: true});
    	while(this.state.isPlaying === true) {
    		while (this.state.nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        	this.scheduleNote();
        	this.nextNote();
    		}
    	}
    }
	}

	nextNote = () => {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / this.state.bpm;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    //nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time
 	this.setState({nextNoteTime: secondsPerBeat});
    //nextNoteTime = secondsPerBeat;
    var currentquarter = this.state.beat + 1;
    this.setState({beat: currentquarter});   // Advance the beat number, wrap to zero
    if (this.state.beat === 4) {
        this.setState({beat: 0});
    }
	}
	
	scheduleNote = () => {
    // push the note on the queue, even if we're not playing.
    const array = this.state.notesinQueue.push({note: this.state.beat, time: this.state.nextNoteTime});
    this.setState({notesinQueue: array});

    // create an oscillator
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
 
    if(this.state.beat % 4 === 0) {
    	osc.frequency.value = 880;
    }
    else {
    	osc.frequency.value = 220.0;
    }
    osc.start( this.state.nextNoteTime );
    osc.stop( this.state.nextNoteTime + noteLength ); //?
    //osc.start();
    //osc.stop(audioContext.currentTime + 1);

	}

	/*function play() {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }

    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }*/
//}

	render() {
		//const{isPlaying, bpm} = this.state;
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
			<button onClick={this.test}>{this.state.isPlaying ? 'Stop Metronome' : 'Play Metronome'}</button>
		</div>
	}
}

export default Metronome;