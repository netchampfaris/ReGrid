/* globals $ */
import { getHeaderHTML } from './utils';

export default class Header {
  constructor(wrapper, columns) {
    this.wrapper = wrapper;
    this.columns = columns;
    this.render();
    this.bindEvents();
  }

  render() {
    this.wrapper.html(getHeaderHTML(this.columns));
  }

  bindEvents() {
    this.bindResizeColumn();
  }

  bindResizeColumn() {
    const self = this;
    let isDragging = false;
    let $currCell, startWidth, startX;

    this.wrapper.on('mousedown', '.data-table-col', function (e) {
      $currCell = $(this);
      const colIndex = $currCell.attr('data-col-index');
      const col = self.getColumn(colIndex);

      if (col && col.resizable === false) {
        return;
      }

      isDragging = true;
      startWidth = $currCell.find('.content').width();
      startX = e.pageX;
    });

    $('body').on('mouseup', function (e) {
      if (!$currCell) return;
      isDragging = false;
      const colIndex = $currCell.attr('data-col-index');

      if ($currCell) {
        const width = parseInt($currCell.find('.content').css('width'), 10);

        self.setColumnWidth(colIndex, width);
        self.setBodyWidth();
        $currCell = null;
      }
    });

    $('body').on('mousemove', function (e) {
      if (!isDragging) return;
      const finalWidth = startWidth + (e.pageX - startX);
      const colIndex = $currCell.attr('data-col-index');

      if (self.getColumnMinWidth(colIndex) > finalWidth) {
        // don't resize past minWidth
        return;
      }

      self.setColumnHeaderWidth(colIndex, finalWidth);
    });
  }
}
