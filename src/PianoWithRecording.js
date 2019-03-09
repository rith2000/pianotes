import  React  from 'react';
import { Piano } from 'react-piano';

class PianoWithRecording extends React.Component {
  state = {
    keysDown: {},
    notesRecorded: true,
    noteStart: 0,
    originTime: 0,
    restStart: 0,
  };

  onPlayNoteInput = midiNumber => {
    if (global.startFlag){
      this.setState({
        originTime: Date.now()/1000,
      })
       global.startFlag = false;
    }
    if (this.state.notesRecorded === true) {
      this.setState({
        notesRecorded: false,
        noteStart: Date.now()/1000
      });
      console.log("onPlay");
      if (global.startRest){
        this.recordRests(Date.now()/1000-this.state.restStart);
      }
    }
  };

  onStopNoteInput = (midiNumber, { prevActiveNotes }) => {   
    if (this.state.notesRecorded === false) {
      this.setState({
        notesRecorded: true,
        restStart: Date.now()/1000
      });
      this.recordNotes(midiNumber, prevActiveNotes, Date.now()/1000-this.state.noteStart);
      console.log("onStop");
      global.startRest =true;
    }
  };

  recordNotes = (midiNumber, midiNumbers, duration) => {
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }
    const newEvents = midiNumbers.map(midiNumber => {
        return {
          midiNumber,
          time: Date.now()/1000 - this.state.originTime,
          duration: duration,
        };
      });
      this.updateNotes(newEvents);
      console.log(global.notes);
    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents),
      currentTime: this.props.recording.currentTime + duration,
    });
  };

  recordRests = (duration) => {
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }
    const newEvents = 
       [{
          midiNumber: -1,//change this to -1 or something later
          time: Date.now()/1000 - this.state.originTime,
          duration: duration,
        }];
        console.log (newEvents);
    // this.props.setRecording({
    //   events: this.props.recording.events.concat(newEvents),
    //   currentTime: this.props.recording.currentTime + duration,
    // });
  };

  updateNotes = (noteArray) =>{
    
    var midiOctave = Math.trunc(noteArray[0].midiNumber / 12);
    var midiNote = Math.trunc(noteArray[0].midiNumber % 12);

    //var midiNote = midiOctave % 12;
    var letterKey = "";

    if (midiNote == 0) 
      letterKey = "C";
    else if (midiNote == 1)
      letterKey = "_D";
    else if (midiNote == 2)
      letterKey = "D";
    else if (midiNote == 3)
      letterKey = "_E";
    else if (midiNote == 4)
      letterKey = "E";
    else if (midiNote == 5)
      letterKey = "F";
    else if (midiNote == 6)
      letterKey = "_G";
    else if (midiNote == 7)
      letterKey = "G";
    else if (midiNote == 8)
      letterKey = "_A";
    else if (midiNote == 9)
      letterKey = "A";
    else if (midiNote == 10)
      letterKey = "_B";
    else if (midiNote == 11)
      letterKey = "B";

    //console.log(duration);
    var dur = this.state.restStart - this.state.noteStart;
    console.log(dur);
    var letterDur = "";

    // dur = Math.trunc(dur)/60 * 100;
    // letterDur = (dur).toString();
    //prob w first note bc origin time

    //debug("hi");
    if (midiOctave == 4) 
      global.notes = global.notes + letterKey;
     else 
      global.notes = global.notes + letterKey.toLowerCase();
    

    console.log (noteArray);
    //later this will hold the converstion
  }

  render() {
    const {
      playNote,
      stopNote,
      recording,
      setRecording,
      ...pianoProps
    } = this.props;

    const { mode, currentEvents } = this.props.recording;
    const activeNotes =
      mode === 'PLAYING' ? currentEvents.map(event => event.midiNumber) : null;
    return (
      <div>
        <Piano
          playNote={this.props.playNote}
          stopNote={this.props.stopNote}
          onPlayNoteInput={this.onPlayNoteInput}
          onStopNoteInput={this.onStopNoteInput}
          activeNotes={activeNotes}
          {...pianoProps}
        />
      </div>
    );
  }
}

export default PianoWithRecording;
