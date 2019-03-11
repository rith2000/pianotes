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

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('c5'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
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
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
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
        <h1 className="h3"> <center> <font face="precious">Pianotes </font></center> </h1>
         <p>
          {" "}
          <center>
            {" "}
            <font face="garamond">
              {" "}
              A web-app that translates piano playing into sheet music.{" "}
            </font>{" "}
          </center>{" "}
        </p>
         
        <div className="mt-5">

          <ScoreDisplay/>

        </div>
        
        <p> {" "}  </p>
        <div className="mt-5">
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
                width={1200}
                playNote={playNote}
                stopNote={stopNote}
                disabled={isLoading}
                keyboardShortcuts={keyboardShortcuts}
              />
            </center>
            )}
          />
        </div>
        <p> {" "}  </p>
        <div className="mt-5">
         <center>
          <button onClick={this.onClickPlay}>Play</button>
          
          <button onClick={this.onClickStop}>Stop</button>
          <button onClick={this.onClickClear}>Clear</button>
         </center>
        </div>
        <div className="mt-5">
          <strong>Recorded notes</strong>
          <div>{JSON.stringify(this.state.recording.events)}</div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
