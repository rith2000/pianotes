import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import './global.js'
import DimensionsProvider from './DimensionsProvider';
import SoundfontProvider from './SoundfontProvider';
import PianoWithRecording from './PianoWithRecording';
import ScoreDisplay from './ScoreDisplay';

import 'bootstrap/dist/css/bootstrap.min.css';
import DropDown from './DropDown.js';
import Slider from './Slider.js';
import './Metronome.css';

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

let firstNote = 3;
let lastNote = 4;

let noteRange = {
  first: MidiNumbers.fromNote('c' + firstNote),
  last: MidiNumbers.fromNote('c' + lastNote),
 
};

let keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: noteRange.first,
    lastNote: noteRange.first + 11,
  
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

class App extends React.Component {
  state = {
    recording: {
      mode: 'RECORDING',
      events: [],
      currentTime: 0,
      currentEvents: [],

    },
    firstNote: noteRange.first,
    lastNote: noteRange.first + 11,
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
 
  resetKeyboard = () =>{
    keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: noteRange.first,
      lastNote: noteRange.first + 11,
    
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });
  }

  increaseOctave = () =>{
    firstNote = firstNote + 1;
    lastNote = lastNote + 1;
    noteRange.first = MidiNumbers.fromNote('c' + firstNote);
    noteRange.last = MidiNumbers.fromNote('c' + lastNote);

    this.resetKeyboard();
  }

  decreaseOctave = () =>{
    firstNote = firstNote - 1;
    lastNote = lastNote - 1;
    noteRange.first = MidiNumbers.fromNote('c' + firstNote);
    noteRange.last = MidiNumbers.fromNote('c' + lastNote);
  
    this.resetKeyboard();
  }
  
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    if(event.keyCode === 39 || event.keyCode === 38){
      this.increaseOctave();
    }
    if(event.keyCode === 37 || event.keyCode === 40){
      this.decreaseOctave();
    }
  }

  getRecordingEndTime = () => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map(event => event.time + event.duration),
    );
  };

  setRecording = value => {
    this.setState({
      recording: Object.assign({}, this.state.recording, value),
    });
  };

  onClickPlay = () => {
    this.setRecording({
      mode: 'PLAYING',
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, event => [
        event.time,
        event.time + event.duration,
      ]),
    );
    startAndEndTimes.forEach(time => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter(event => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents,
          });
        }, time * 1000),
      );
    });
    // Stop at the end
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach(scheduledEvent => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      mode: 'RECORDING',
      currentEvents: [],
    });
  };

  onClickClear = () => {
    this.onClickStop();
    this.setRecording({
      events: [],
      mode: 'RECORDING',
      currentEvents: [],
      currentTime: 0,
    });
    global.startFlag = true;
    global.startRest = false;
    global.notes=``;
	  global.beat_count = 0;
  };

  render() {
    return (
      
      <div>
    
       <p> {" "}  </p>
        <h1 className="h3"> <center> <font face="precious"> <font size="7"> Pianotes </font></font></center> </h1>
         <p>
          {" "}
          <center>
            {" "}
            <font face="garamond"><font size="5">
              {" "}
              A web-app that translates piano playing into sheet music.{" "}
            </font></font>{" "}
          </center>{" "}
        </p>
         
        

        <p> {" "}  </p>
        <div className="mt-5">
        <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
          <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
            <center>
              <PianoWithRecording
                recording={this.state.recording}
                setRecording={this.setRecording}
                noteRange={noteRange}
                width={containerWidth * 0.4}
                playNote={playNote}
                stopNote={stopNote}
                disabled={isLoading}
                keyboardShortcuts={keyboardShortcuts}
    
              />
            </center>
            )}
          />
          )}
          </DimensionsProvider>
        </div>
        <p> {" "}  </p>
        <center>
         <p> {" "}  </p>
          <div>
         
            <Slider></Slider>
          </div>
        
        <div className="mt-5">
         
          <button className="btn" onClick={this.onClickPlay}>Play</button>{" "}


          <button className="btn" onClick={this.onClickStop}>Stop</button>{" "}
          <button className="btn" onClick={this.onClickClear}>Clear</button>{" "}
	       <DropDown></DropDown>
         </div>

          </center>

          <center>
        <div className="mt-5">

          <ScoreDisplay/>

        </div>
          </center>
        
        
      </div>
    );
  }
}

/* exports.resetKeyboard = function() {
    keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: noteRange.first,
      lastNote: noteRange.first + 11,
    
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });
  }

exports.increaseOctave = function() {
	firstNote = firstNote + 1;
    lastNote = lastNote + 1;
    noteRange.first = MidiNumbers.fromNote('c' + firstNote);
    noteRange.last = MidiNumbers.fromNote('c' + lastNote);

    this.resetKeyboard();
};

exports.decreaseOctave = function(){
	firstNote = firstNote + 1;
    lastNote = lastNote + 1;
    noteRange.first = MidiNumbers.fromNote('c' + firstNote);
    noteRange.last = MidiNumbers.fromNote('c' + lastNote);

    this.resetKeyboard();
}; */

export default App;

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);