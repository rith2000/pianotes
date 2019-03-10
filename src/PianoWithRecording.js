import  React  from 'react';
import { Piano } from 'react-piano';

class PianoWithRecording extends React.Component {
  state = {
    keysDown: {},
    notesRecorded: true,
    noteStart: 0,
    originTime: 0,
    restStart: 0,
	clip_factor: 1.25,
	clip_rest: .65,
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
		this.updateNotes(newEvents);
    // this.props.setRecording({
    //   events: this.props.recording.events.concat(newEvents),
    //   currentTime: this.props.recording.currentTime + duration,
    // });
  };

  
  updateNotes = (noteArray) =>{
    
	this.state.clip_factor = 1.25;
	
	var metro = global.metronome;
	var pos = metro.lastIndexOf("=");
	metro = parseInt(metro.substring(pos+1, metro.length-1));
	metro /= 15;
	
	var dur = Math.round(noteArray[0].duration*metro*this.state.clip_factor);
	var durRest = Math.round(noteArray[0].duration*metro*this.state.clip_rest);
	
	var letterKey = "";
	if((noteArray[0].midiNumber == -1) && (durRest != 0))
	{
		letterKey="z";
		dur = durRest;
	}
	
    var midiOctave = Math.trunc(noteArray[0].midiNumber / 12);
    var midiNote = Math.trunc(noteArray[0].midiNumber % 12);
	
    //var midiNote = midiOctave % 12;
	
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
  
	if(dur == 0)
	{
		dur = 1;
	}
	
	var s= dur.toString();
	
	if(letterKey == "")
		s = "";
	else 
		global.beat_count += dur;
	
    if (midiOctave == 4)
      global.notes = global.notes + letterKey + s;
     else 
      global.notes = global.notes + letterKey.toLowerCase() + s;

	if(global.beat_count >= 16)
	{
		global.notes = global.notes + "|";
		global.beat_count = 0;
	}
	if(global.beat_count % 4 == 0)
		global.notes = global.notes + " ";
	
	if(noteArray == [])
		global.beat_count = 0;
	
    console.log (global.beat_count);
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
