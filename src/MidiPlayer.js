import React from 'react';
import { Midi } from 'react-abc';
import PianoWithRecording from './PianoWithRecording';

const notation1 = global.notes;

class MidiPlayer extends React.Component {
  state = {
    notation: global.notes
  };

  render() {
    let notes = global.notes;
    console.log("here: " + global.notes);
    let notation = notes + "c2";

    console.log("type: " + typeof global.notes);
    console.log("type: " + typeof notation1);
    return (
     <div>
    	<Midi notation={notes}/>
  	</div>
    );
  }
}

export default MidiPlayer;
