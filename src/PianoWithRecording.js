import  React  from 'react';
import { Piano } from 'react-piano';
import { Midi } from 'react-abc';
import { App } from './index.js';


class PianoWithRecording extends React.Component {

   constructor(){
    super();
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  };

  state = {
    keysDown: {},
    notesRecorded: true,
    noteStart: 0,
    originTime: 0,
    restStart: 0,
   clip_factor: 1.25,
   clip_rest: 1.00,
   notes: `abc`,
  };

  onPlayNoteInput = midiNumber => {
    if (global.startFlag){
      this.setState({
        originTime: Date.now()/1000, //needed?
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

      //console.log("onStop");
      global.startRest =true;
    }
  };

  recordNotes = (midiNumber, midiNumbers, duration) => {
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }
    let count = 0;

    const newEvents = midiNumbers.map(midiNum => {
      count+= 1;
      // console.log("Count" + count + "midiNUm: " + midiNum);
      return {
        midiValue: midiNum,
        time: Date.now()/1000 - this.state.originTime,
        duration: duration,
      };
    });
    // console.log(midiNumber);
    
    this.updateNotes(newEvents);
    
    // console.log(global.notes);
    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents), //needed??
      currentTime: this.props.recording.currentTime + duration,
    });
  };

  recordRests = (duration) => {
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }

    //console.log("recording: " + global.notes);
    // console.log("recording\n");

    
        const newEvents = 
           [{
              midiValue: -1,//change this to -1 or something later
              time: Date.now()/1000 - this.state.originTime,
              duration: duration,
            }];

      if (duration > 0.5) {
        this.updateNotes(newEvents);

      }
    
        //console.log(duration);
        //console.log (newEvents);
  };


  dotRem = (orig) =>{
    let acc = 0;
  	let twoDivide = 0;
  	let i = 0;
  	while (Math.pow(2, i) <= orig)
  	{
  		twoDivide = Math.pow(2,i);
  		i++;
  	}

  	while ((acc + twoDivide) <= orig && twoDivide !== 0)
  	{
  		acc += twoDivide;
  		twoDivide /= 2;
  	}

  	return acc;
  };

  insertPitch = (letterKey,dur, base_per_measure) =>{
    let dotted = this.dotRem(dur,0);
      if (dotted === dur)
      {
        global.notes += letterKey + dur.toString(); 
      }
      
      else
      {
        global.notes += "(" + letterKey + dotted.toString() + letterKey + (dur-dotted).toString() + ")";
      }
      global.beat_count = (dur + global.beat_count)% base_per_measure;


  }

  updateNotes = (noteArray) =>{

    this.setState({
        notes: "a2a2a2",
      })

    this.state.notes = "bc";
    // console.log(noteArray[0].midiValue);
    let beat_per_measure = global.measureUpdated; //beats per measure
    let pos2 = beat_per_measure.lastIndexOf(":");
    beat_per_measure = parseInt(beat_per_measure.substring(pos2 + 1));

    let pos3 = global.measureUpdated.lastIndexOf("/");
    let beatvalue = parseInt(global.measureUpdated.substring(pos3 + 1));
    //console.log(beatvalue);

    let pos4 = global.length.lastIndexOf("/");
    let basevalue = parseInt(global.length.substring(pos4+1));
    //ie. 16th, 32nd note as the shortest possible note
    //all note durations are added in terms of the base note duration
    //console.log(basevalue);

    let pos = global.metronome.lastIndexOf("=");
    let tempo = parseInt(global.metronome.substring(pos+1));
    let beats_to_basenote = beatvalue/basevalue;
    let seconds_per_basenote = 60/ tempo * beats_to_basenote; //std to 60, where 1q = 1s, 
    //this assumes the beat is a quarter... fix!
    // console.log("beat per measure" + beat_per_measure);

    let base_per_measure = beat_per_measure / beats_to_basenote;
    // console.log("base per measure" + base_per_measure);
    
    let dur = Math.round(noteArray[0].duration/seconds_per_basenote); 
    // console.log(noteArray[0].duration/seconds_per_basenote) 
    // console.log(noteArray[0].duration);
    //duration in terms of base note
    
    var letterKey = "";
    if(noteArray[0].midiValue === -1) //rests
    {
        letterKey = "z";
        if(dur >= 8 * base_per_measure){ //magic number
          // console.log("PAUSE")
          this.props.pause();
          dur = 9 * base_per_measure - global.beat_count;
        }
    } else {
    
      var midiOctave = Math.trunc(noteArray[0].midiValue / 12);
      var midiNote = Math.trunc(noteArray[0].midiValue % 12);
    

      switch(midiNote) {
        case(0):
          letterKey = "C";
          break;
        case(1):
          letterKey = "_D";
          break;
        case(2):
          letterKey = "D";
          break;
        case(3):
          letterKey = "_E";
          break;
        case(4):
          letterKey = "E";
          break;
        case(5):
          letterKey = "F";
          break;
        case(6):
          letterKey = "_G";
          break;
        case(7):
          letterKey = "G";
          break;
        case(8):
          letterKey = "_A";
          break;
        case(9):
          letterKey = "A";
          break;
        case(10):
          letterKey = "_B";
          break;
        case(11):
          letterKey = "B";
          break;
      }
    }
      
      if(dur === 0)
      {
        dur = 1;
      }

      //determine octave
      if(midiOctave > 4){ //remove magic num later
        for(let i = 0; i < midiOctave - 4; i++){
          letterKey += '\''; //up an octave
        }
      } else if (midiOctave < 4){
        for(let i = 0; i < 4 - midiOctave; i++){
          letterKey += ','; //down an octave
        }
      }

      //purpose??
      //if(letterKey == "" || letterKey == "]")
        //durString = "";
      
      //tie
      // console.log("dur:" + dur);
      // console.log("gbc:" + global.beat_count);
      if(global.beat_count + dur > base_per_measure){
        let frontRemainder = base_per_measure - global.beat_count;
        // console.log("front rem:" + frontRemainder);
        let backRemainder = dur - frontRemainder;
        dur = backRemainder % base_per_measure;
        global.notes += "(";
        this.insertPitch(letterKey, frontRemainder, base_per_measure);
        global.notes +=  "|";
        global.measure_num+=1;
        if (global.measure_num >= 2)
        {
          global.notes += "\n";
          global.measure_num = 0;
        }
        // console.log("back rem:" + backRemainder);
        let tieDur = 0;
        while(backRemainder > 0){
          // console.log("entered loop")
          if(backRemainder > base_per_measure){
            tieDur = base_per_measure;
          } else {
            tieDur = backRemainder % (base_per_measure);
          }
          if(tieDur === 0){
            tieDur = base_per_measure;
          }
          this.insertPitch(letterKey,tieDur, base_per_measure);
          //global.notes += letterKey + tieDur.toString();
          if(tieDur === base_per_measure){
            if(backRemainder - tieDur === 0){
              global.notes += ")";
            } else{
               global.notes += "|"
               global.measure_num += 1;
            }
            
            //global.beat_count = 0;
            if(global.measure_num >= 2)
            {
              global.notes = global.notes + "\n";
              global.measure_num = 0;
            }
          }
          backRemainder -= tieDur;
      }
      //
      if(tieDur != base_per_measure){ //if the last note wasn't a measure
        global.notes += ")"
      }

    } else{ //normal insertion
      //global.notes += letterKey + dur.toString();
      this.insertPitch(letterKey, dur, base_per_measure);
    }
     
    //global.beat_count = (dur + global.beat_count)% base_per_measure; //add to beat count
    //wrap in insert pitch
    // console.log("measurenum" + global.measure_num);
    // console.log(global.beat_count);
    // console.log(base_per_measure);

    if(global.beat_count === 0)
    {
      console.log("measure break!!");
      global.notes = global.notes + "|";
      //global.beat_count = 0;
      global.measure_num += 1;
    }

    if(global.measure_num >= 2)
    {
      console.log("measure break!!");
      global.notes = global.notes + "\n";
      global.measure_num = 0;
    }
    
    if(global.beat_count % 4 == 0)
      global.notes = global.notes + " "; //why???
    
    
    //meant to act for clear button 
    /*
    if(noteArray == [])
      global.beat_count = 0;
    */

    //this.forceUpdate();
  }


  forceUpdateHandler(){
  // this.setState({
  //   notes: global.notes
  // });
      this.forceUpdate();
      console.log(global.notes);
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
    //const mode = this.props.recording.mode;
    //const currentEvents = this.props.recording.events;
    const activeNotes =
      mode === 'PLAYING' ? currentEvents.map(event => event.midiValue) : null;
    //console.log(activeNotes);
    console.log("blah");
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
      <Midi notation={global.notes}/>
      <button onClick= {this.forceUpdateHandler} >FORCE UPDATE</button>

      </div>
    );
  }
}

export default PianoWithRecording;


