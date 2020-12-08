import {Calendar} from './Calendar';

var doc = new window.pdfkit.PDFDocument({
  layout: 'landscape',
  size: 'A4',
  margin: 20,
  info: {
    Author: 'Guillaume Beraudo',
  }
});

//doc.pipe(fs.createWriteStream('./output.pdf')); // write to PDF
const stream = doc.pipe(blobStream());

const d = new Date();
const area = {xmin: 20, ymin: 45, xmax: 820, ymax: 580};
const calendar = new Calendar({
  doc,
  year: 2002,
  month: d.getMonth(),
  area,
  lang: 'fr',
  mainColor: 'purple',
  secondColor: 'grey',
});
calendar.render();
doc.end();
stream.on('finish', function() {
  const url = stream.toBlobURL('application/pdf');
//  iframe.src = url;
});