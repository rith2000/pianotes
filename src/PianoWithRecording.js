import React from 'react';
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
    if (noteArray[0].midiNumber === 48)
    {
      global.notes = global.notes + "c";
    }
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
