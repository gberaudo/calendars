/**
 * @typedef Area
 * @type {Object}
 * @property {number} xmin
 * @property {number} xmax
 * @property {number} ymin
 * @property {number} ymax
 */

/**
 * @typedef CalendarParams
 * @type {Object}
 * @property {PDFKit.PDFDocument} doc 
 * @property {number} year
 * @property {number} month
 * @property {string} mainColor
 * @property {string} secondColor
 * @property {Area} area
 * @property {string} lang
 */


export class Calendar {
  /**
   * 
   * @param {CalendarParams} options 
   */
  constructor(options) {
    this.doc = options.doc;
    const {year, month} = options;
    this.mainColor = options.mainColor;
    this.secondColor = options.secondColor;
    this.area = options.area;
    this.date1 = new Date(year, month, 1);
    this.lastDay = new Date(year, month + 1, 0).getDate();
    this.firstNumberedCell = (7 + this.date1.getDay() - 1) % 7;
    this.lastNumberedCell = this.firstNumberedCell + this.lastDay - 1;
    this.cols = 7;
    this.rows = Math.ceil((this.lastDay + this.firstNumberedCell) / this.cols);
    this.lang = options.lang;
    this.cellDimensions = {
      width: (this.area.xmax - this.area.xmin) / this.cols,
      height: (this.area.ymax - this.area.ymin) / this.rows, 
    };
  }

  render() {
    this.writeTitle();
    this.renderHeader();
    this.renderCells();
  }

  renderHeader() {

  }

  renderCells() {
    const area = this.area;
    const dims = this.cellDimensions;
    let firstNumberedCell = this.firstNumberedCell;
    let lastNumberedCell = this.lastNumberedCell;

    const doc = this.doc;
    doc.save()
      .lineWidth(1)
      .fillOpacity(0.2)
      .strokeOpacity(1);

    for (let n = 0; n < this.cols * this.rows; ++n) {
      const i = n % this.cols;
      const j = Math.floor(n / this.cols);
      const x = area.xmin + i * dims.width;
      const y = area.ymin + j * dims.height;
      const isNumberedCell = n >= firstNumberedCell && n <= lastNumberedCell;
      const fillColor = isNumberedCell ? '' : this.secondColor;

      if (isNumberedCell) {
        const day = n - firstNumberedCell + 1;
        const text = day.toFixed();
        doc.save();
        doc.fillOpacity(1).fillColor(i >= 5 ? this.mainColor : this.secondColor);
        doc.fontSize(16).text(text, x + 7, y + 7);
        doc.restore();
      }
      doc.rect(x, y, dims.width, dims.height);
      if (fillColor) {
        doc.fillAndStroke(fillColor, this.mainColor);
      } else {
        doc.stroke(this.mainColor);
      }

    }

    doc.restore();
  }

  writeTitle() {
    let month = this.date1.toLocaleString(this.lang, {month: 'long'});
    month = month[0].toUpperCase() + month.substr(1);
    const text = `${month} ${this.date1.getFullYear()}`;
    this.doc.info.Title = text;
    this.doc
      .font('Times-Roman')
      .fontSize(25).text(text, 20, 20);
  }
}
