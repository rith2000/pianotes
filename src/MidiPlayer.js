import React from 'react';
import { Midi } from 'react-abc';



class MidiPlayer extends React.Component {

  constructor(props){
 	super(props);
 	// this.state = {notes: ``}
  }
  
  // functionCall = (){
  // 	this.setState({notes: `b2c2a2`});
  // }

  // componentDidUpdate(prevState){
  // 	if (prevState.notes !== this.state.notes){
  		
  // 	} 
  // }

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
       <Midi notatation = {notation}>
    	
  	</div>
  	  

    );
  }
}

export default MidiPlayer;
