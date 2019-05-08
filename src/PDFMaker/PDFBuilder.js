import { html2canvas } from "html2canvas";

class PDFBuilder extends Component {
    html2canvas(document.querySelector("#capture")).then(canvas => {
        document.body.appendChild(canvas)
    });
render() {
    <div id="capture" style="padding: 10px; background: #f5da55">
        <h4 style="color: #000; ">Hello world!</h4>
    </div>
};
}

class DownloadButton extends Component {
    handleClick = () => {
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
