import React, { Component } from "react";
import { saveAs } from "file-saver";
import { Notation } from "react-abc";
// import *html2canvas  from "html2canvas";

class DownloadButton extends Component {
  componentDidMount() {

  }
  handleClick = () => {
    // html2canvas(document.querySelector("#capture")).then(canvas => {
    //   document.body.appendChild(canvas)
    // })

    var blob = new Blob([global.notes], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "Successful test Juan.txt");
  };
  render() {
    return (
      <div>
        <button onClick={() => this.handleClick()}>Download your file!</button>
      </div>
    );
  }
}

export default DownloadButton;
