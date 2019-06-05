import React from 'react';
import { Midi } from 'react-abc';



class MidiPlayer extends React.Component {

  state = {
  	notes: `fff`
  }

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
  	// if (componentDidUpdate(this.state))
  	// 	this.setState({ notes: `a2b2c2`});
  	// functionCall();
  	//<MidiPlayer changeNotes = {(this.state.notes)=>addNotes}>


  	//<Midi notation={this.state.notes}/>
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
        <h1 onClick= { () => this.props.addNotes(this.state.notes)}>hello</h1>
    	
  	</div>
  	  

    );
  }
}

export default MidiPlayer;
