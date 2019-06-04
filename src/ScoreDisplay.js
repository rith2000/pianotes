import React from 'react';
import { Notation } from 'react-abc';

class ScoreDisplay extends React.Component {
  render() {
    let notation = 
		global.composer +
		global.measure +
		global.length +
		global.metronome +
		global.noteStart +
		global.notes;
		//global.noteEnd;
    return (
     <div>
    	<Notation notation={notation}/>
  	</div>
    );
  }
}

export default ScoreDisplay;
