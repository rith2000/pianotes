import React, { Component } from "react";
import { saveAs } from "file-saver";
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";
import '../Metronome.css';

// IMPORTANT: As of now, this component is not being used

class DownloadButton extends Component {
  render() {
    return (

      <div className = "rightt-download">
        <button className="btn1" onClick={() => window.print()}>Download</button>

   
      </div>
    );
  }
}

export default DownloadButton;