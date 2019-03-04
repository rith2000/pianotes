import React from 'react';
import { Midi } from 'react-abc';

class MidiPlayer extends React.Component {
  render() {
    let notation = 
		global.composer +
		global.measure +
		global.length +
		global.metronome +
		global.clef +
		global.noteStart +
		global.notes +
		global.noteEnd;
    return (
     <div>
    	<Midi notation={notation}/>
  	</div>
    );
  }
}

export default MidiPlayer;
