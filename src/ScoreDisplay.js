import React from 'react';
import { Notation } from 'react-abc';

class ScoreDisplay extends React.Component {
  constructor(props){
  	super(props);
  }

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
    	<Notation notation={notation}/>
  	</div>
    );
  }
}

export default ScoreDisplay;
