import React, { Component } from "react";
import { saveAs } from "file-saver";
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";

class DownloadButton extends Component {
  makePDF = () => {
    var doc = new jsPDF();

    doc.text('Success! It\'s party time!', 10, 10)
    doc.save('Your masterpiece  .pdf')
  }
  handleClick = () => {
    var blob = new Blob([global.notes], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "Successful test Juan.txt");

  };
  render() {
    return (
      <div>
        <button onClick={() => window.print()}>Download your file!</button>
      </div>
    );
  }
}

export default DownloadButton;