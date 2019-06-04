import React, { Component } from "react";
import { saveAs } from "file-saver";
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";

class DownloadButton extends Component {
  render() {
    return (
      <div>
        <button onClick={() => window.print()}>Download your file!</button>
      </div>
    );
  }
}

export default DownloadButton;