import React from 'react';
import { Midi } from 'react-abc';



class MidiPlayer extends React.Component {

  constructor(){
 	super();
 	this.state = {notes: `a2a2a2`}
  }
  

  // componentDidUpdate(prevProps){
  // 	if (this.state.notes == prevProps.notes){
  // 		this.setState({
  // 			notes: `a2c2e2`
  // 		});
  // 	}j
  // }

  componentDidUpdate(prevState){
  	if (prevState.notes !== this.state.notes){
  		
  	} 
  }

  render() {
  	// if (componentDidUpdate(this.state))
  	// 	this.setState({ notes: `a2b2c2`});
    let notation = 
		global.composer +
		global.measure +
		global.length +
		global.metronome +
		global.clef +
		global.noteStart +
		this.state.notes +
		global.noteEnd;
	
    return (
     <div>
    	<Midi notation={notation}/>
  	</div>
    );
  }
}

export default MidiPlayer;