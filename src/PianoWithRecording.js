import  React  from 'react';
import { Piano } from 'react-piano';
//import { App } from './index.js';

class Staff{
  constructor(number){
    this.number = number,
    this.notes = "V: V" + number + " ",
    this.beat_count = 0,
    this.rest_remainder = 0, //remainder from measure in which this string was last used
    this.measure_last_played = 0
    this.measure_num = 0
  }

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
        this.notes += letterKey + dur.toString(); 
      }
      
      else
      {
        this.notes += "(" + letterKey + dotted.toString() + letterKey + (dur-dotted).toString() + ")";
      }
      this.beat_count = (dur + this.beat_count)% base_per_measure;
  }

  updateNotes = (noteArray) =>{
    console.log(noteArray[0].midiValue);
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
    console.log("beat per measure" + beat_per_measure);

    let base_per_measure = beat_per_measure / beats_to_basenote;
    console.log("base per measure" + base_per_measure);
    
    let dur = Math.round(noteArray[0].duration/seconds_per_basenote); 
    console.log(noteArray[0].duration/seconds_per_basenote) 
    console.log(noteArray[0].duration);
    //duration in terms of base note
    
    
    var letterKey = "";
    if(noteArray[0].midiValue === -1) //rests
    {
        letterKey = "z";
        if(dur >= 8 * base_per_measure){ //magic number
          console.log("PAUSE")
          this.props.pause();
          dur = 9 * base_per_measure - this.beat_count;
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
      console.log("dur:" + dur);
      console.log("gbc:" + this.beat_count);
      if(this.beat_count + dur > base_per_measure){
        let frontRemainder = base_per_measure - this.beat_count;
        console.log("front rem:" + frontRemainder);
        let backRemainder = dur - frontRemainder;
        dur = backRemainder % base_per_measure;
        this.notes += "(";
        this.insertPitch(letterKey, frontRemainder, base_per_measure);
        this.notes +=  "|";
        this.measure_num+=1;
        if (this.measure_num >= 2)
        {
          this.notes += "\n";
          this.measure_num = 0;
        }
        console.log("back rem:" + backRemainder);
        let tieDur = 0;
        while(backRemainder > 0){
          console.log("entered loop")
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
            if(backRemainder - tieDur == 0){
              this.notes += ")";
            } else{
               this.notes += "|"
               this.measure_num += 1;
            }
            
            //global.beat_count = 0;
            if(this.measure_num >= 2)
            {
              this.notes = this.notes + "\n";
              this.measure_num = 0;
            }
          }
          backRemainder -= tieDur;
      }
      //
      if(tieDur != base_per_measure){ //if the last note wasn't a measure
        this.notes += ")"
      }

    } else{ //normal insertion
      //global.notes += letterKey + dur.toString();
      this.insertPitch(letterKey, dur, base_per_measure);
    }
     
    //global.beat_count = (dur + global.beat_count)% base_per_measure; //add to beat count
    //wrap in insert pitch
    console.log("measurenum" + this.measure_num);
    console.log(this.beat_count);
    console.log(base_per_measure);

    if(this.beat_count === 0)
    {
      console.log("measure break!!");
      this.notes = this.notes + "|";
      //global.beat_count = 0;
      this.measure_num += 1;
    }

    if(this.measure_num >= 2)
    {
      console.log("measure break!!");
      this.notes = this.notes + "\n";
      this.measure_num = 0;
    }
    
    if(this.beat_count % 4 == 0)
      this.notes = this.notes + " "; //why???
    
    
    //meant to act for clear button 
    /*
    if(noteArray == [])
      global.beat_count = 0;
    */
  }
}

//may need to pass event handlers to staves as well? to maintain state/origin time stuff? streamline?

class PianoWithRecording extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      keysDown: {},
      notesRecorded: true,
      noteStart: 0,
      originTime: 0,
      restStart: 0,
      clip_factor: 1.25,
      clip_rest: 1.00,
      staff_objects: [new Staff(1), new Staff(2), new Staff(3), new Staff(4), new Staff(5)],
      staffs: [0,1,2,3,4],
      staffs_curnote: {}
    };
  }

  onPlayNoteInput = midiNumber => {
    console.log("CHECK")
    if (global.startFlag){
      this.setState({
        originTime: Date.now()/1000, //needed?
      })
       global.startFlag = false;
    }
    let temp_num = this.state.staffs[0];
    console.log(this.state.staff_objects)
    let staff = this.state.staff_objects[temp_num];
    console.log(staff);
    //pop first staff off the stack
    this.setState(state => {
      const [first, ...rest] = state.staffs;
      return {
        staffs: rest,
        notesRecorded: false,
        noteStart: Date.now()/1000,
      };
    });
    this.setState({
      staffs_curnote: {
        [midiNumber]: temp_num
      }
    })
    if (global.startRest) {
      this.recordRests(Date.now()/1000-this.state.restStart);
    }
  };

  onStopNoteInput = (midiNumber, { prevActiveNotes }) => {   
    this.setState({
      notesRecorded: true,
      restStart: Date.now()/1000
    });
    this.recordNotes(midiNumber, prevActiveNotes, Date.now()/1000-this.state.noteStart);

    //console.log("onStop");
    global.startRest =true;
  };

  recordNotes = (midiNumber, midiNumbers, duration) => {
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }
    //let count = 0;
    const newEvents = midiNumbers.map(midiNum => {
      //count+= 1;
      //console.log("Count" + count + "midiNUm: " + midiNum);
      return {
        midiValue: midiNum,
        time: Date.now()/1000 - this.state.originTime,
        duration: duration,
      };
    });
    if(newEvents.length === 0){
      return;
    }
    console.log(midiNumber);
    console.log(newEvents);
    console.log("NOTE");
    this.printNotes(newEvents);
    console.log(this.notes);
    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents), //needed??
      currentTime: this.props.recording.currentTime + duration,
    });
  };

  recordRests = (duration) => {
    if(duration <= .5){
      return;
    }
    if (this.props.recording.mode !== 'RECORDING') {
      return;
    }
    let temp_num = this.state.staffs[0];
    console.log(this.state.staff_objects)
    let staff = this.state.staff_objects[temp_num];
    console.log(staff);
    //pop first staff off the stack
    this.setState(state => {
      const [first, ...rest] = state.staffs;
      return {
        staffs: rest,
        //notesRecorded: false,
        //noteStart: Date.now()/1000,
      };
    });
    this.setState({
      staffs_curnote: {
        [-1]: temp_num
      }
    })

    const newEvents = 
    [{
      midiValue: -1,//change this to -1 or something later
      time: Date.now()/1000 - this.state.originTime,
      duration: duration,
    }];

    console.log("REST");

    if (duration > 0.5) {
      this.printNotes(newEvents);
    }
  };

  printNotes = (events) => {
    console.log(this.state)
    console.log(events);
    //let staff_num = this.state.staffs_curnote[events.midiValue]; //grab staff number
    //console.log(staff_num);
    console.log(events[0].midiValue);
    let staff_num = this.state.staffs_curnote[events[0].midiValue]; //grab staff number
    console.log(staff_num);
    this.state.staff_objects[staff_num].updateNotes(events); //update individual staff
    //push back onto the stack!
    this.setState(state => {
      const list = state.staffs.concat(staff_num);
      return {
        list
      };
    });
    global.notes = '';
    this.state.staff_objects.forEach(staff => {
      global.notes += staff.notes + "\n";
    })
    console.log(global.notes)
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
          activeNotes={activeNotes} //investigate
          {...pianoProps}
        />
      </div>
    );
  }
}

export default PianoWithRecording;