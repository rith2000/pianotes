import React, { Component } from "react";
import { saveAs } from "file-saver";
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";

// IMPORTANT: As of now, this component is not being used

class DownloadButton extends Component {
  render() {
    return (
      <div>
        <div>
          <button onClick={() => window.print()}>Download your file!</button>
        </div>
        <div>
          Composer: <input type="text"></input>
        </div>
      </div>
    );
  }
}

export default DownloadButton;