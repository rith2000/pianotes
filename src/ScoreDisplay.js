import React from 'react';
import { Notation } from 'react-abc';

class ScoreDisplay extends React.Component {
  constructor(props){
  	super(props);
  }

  componentDidMount(){
  	this.setState({notes: this.props.notes});
  }

  render() {
  		global.notes = this.props.notes;

  		console.log("props.notes: " + this.props.notes);

    let notation = 
		global.composer +
		global.measure +
		global.length +
		global.metronome +
		global.clef +
		global.noteStart +
		global.notes +
		// this.props.notes +
		global.noteEnd;
    return (
     <div>
    	<Notation notation={notation}/>
  	</div>
    );
  }
}

export default ScoreDisplay;
