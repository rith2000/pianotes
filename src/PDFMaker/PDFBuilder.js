import * as jsPDF from 'jspdf';

class PDFBuilder extends Component {
    makePDF = () => {
        var doc = new jsPDF();

        doc.text('Hello world!', 10, 10)
        doc.save('a4.pdf')
    }
    render() {
        return (
            makePDF()
        )
    }
}