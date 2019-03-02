import React from 'react';
import { Piano } from 'react-piano';

class PianoWithRecording extends React.Component {
  state = {
    keysDown: {},
    notesRecorded: true,
    noteStart: 0,
    originTime: 0,
    startFlag: true,
  };

  onPlayNoteInput = midiNumber => {
    if (this.state.startFlag){
       this.state.originTime = Date.now()/1000;
       this.state.startFlag = false;
    }
    if (this.state.notesRecorded === true) {
      this.setState({
        notesRecorded: false,
        noteStart: Date.now()/1000
      });
      console.log("onPlay");
    }
    };

  onStopNoteInput = (midiNumber, { prevActiveNotes }) => {   
    if (this.state.notesRecorded === false) {
      this.setState({
        notesRecorded: true,
      });
      console.log(Date.now()/1000-this.state.noteStart);
      this.recordNotes(midiNumber, prevActiveNotes, Date.now()/1000-this.state.noteStart);
      console.log("onStop");
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
    console.log (newEvents);

    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents),
      currentTime: this.props.recording.currentTime + duration,
    });
  };

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
