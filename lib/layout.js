/**
 * @class GridLayout
 * 
 * @param _x
 * @param _y
 * @param _width
 * @param _height
 * @param _lines
 * @param _columns
 * @return
 */
function GridLayout(_x, _y, _width, _height, _lines, _columns, _border) {

	this.from = Scene;
	this.from();

	this.invalid = true;

	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;

	this.currentLine = 0;
	this.currentColumn = 0;

	this.border = _border;
	this.lines = _lines;
	this.columns = _columns;
	this.childs = new Array();

	this.childWidth = 0;
	this.childHeight = 0;
	this.sumOfWidth = 0;

	/**
	 * values from 0 to 1 where the sum must represent 1 to inform the
	 * percentage distribution.
	 */
	this.columnPercentage = new Array();

	this.recalculate = function() {

		this.currentLine = 0;
		this.currentColumn = 0;
		var sumOfWidth = 0;

		this.childWidth = (this.width - (this.border * (this.columns + 1)))
				/ this.columns;
		this.childHeight = (this.height - (this.border * (this.lines + 1)))
				/ this.lines;

		for (key in this.childs) {
			child = this.childs[key];

			child.width = this.childWidth;

			if (this.columnPercentage.length > this.currentColumn) {
				child.width = (child.width * this.columns)
						* this.columnPercentage[this.currentColumn];
			}

			child.height = this.childHeight;

			child.x = this.x + ((this.currentColumn + 1) * this.border)
					+ sumOfWidth;

			sumOfWidth = sumOfWidth + child.width;

			child.y = this.y + ((this.currentLine + 1) * this.border)
					+ (this.currentLine * this.childHeight);

			child.invalid = true;

			this.currentColumn++;

			if (this.currentColumn >= this.columns) {
				this.currentColumn = 0;
				this.currentLine++;
				sumOfWidth = 0;
			}

		}
	};

	// first call
	this.recalculate();

	this.add = function(child) {

		child.width = this.childWidth;

		if (this.columnPercentage.length > this.currentColumn) {
			child.width = (child.width * this.columns)
					* this.columnPercentage[this.currentColumn];
		}

		child.height = this.childHeight;

		child.x = this.x + ((this.currentColumn + 1) * this.border)
				+ this.sumOfWidth;

		this.sumOfWidth = this.sumOfWidth + child.width;

		child.y = this.y + ((this.currentLine + 1) * this.border)
				+ (this.currentLine * this.childHeight);

		child.invalid = true;

		this.childs.push(child);
		this.currentColumn++;

		if (this.currentColumn >= this.columns) {
			this.currentColumn = 0;
			this.sumOfWidth = 0;
			this.currentLine++;
		}
	};

	/**
	 * called by the game main loop
	 */
	this.update = function(_game, current, _child) {

		if (_child.invalid) {
			_child.recalculate();
			_child.invalid = false;
		}

		this.beforeUpdate(_game, child);
		this.clearBackGround(_game.ctx);
		var child = null;
		for (key in this.childs) {
			child = this.childs[key];

			if (child.update) {
				child.update(_game, _child, child);
			}
		}
	};

}