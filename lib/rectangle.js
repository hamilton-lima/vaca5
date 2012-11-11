/**
 * @class Rectangle
 * @return
 */
function Rectangle(_id, _x, _y, _width, _height) {

	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	
	this.remove = false;
	
	// by pass the viewport
	this.fixed = false;

	// drag and drop control
	this.dragX = -1;
	this.dragY = -1;
	this.isDragging = false;
	this.isDraggable = false;

	// for the colision
	this.isColidable = false;

	this.debug = false;

	this.fillColor = NMSColor.AVOCADO;
	this.borderColor = NMSColor.BLUEBERRY;
	this.border = 2;

	this.pointerDownCallbacks = new Array();
	this.pointerUpCallbacks = new Array();
	this.pointerMoveCallbacks = new Array();

	this.pointerDown = function(_game, x, y, _child) {
		for (key in this.pointerDownCallbacks) {
			callback = this.pointerDownCallbacks[key];
			if (callback) {
				var result = callback(_game, x, y, _child);

				// if return true interrupt the process
				if (result) {
					_game.debug
							.log('event consumed - interrupt processing of pointerdown');
					return true;
				}
			}
		}
	};

	this.pointerUp = function(_game, x, y, _child) {
		for (key in this.pointerUpCallbacks) {
			callback = this.pointerUpCallbacks[key];
			if (callback) {
				var result = callback(_game, x, y, _child);

				// if return true interrupt the process
				if (result) {
					_game.debug
							.log('event consumed - interrupt processing of pointerup');
					return true;
				}
			}
		}
	};

	this.pointerMove = function(_game, x, y, _child) {
		for (key in this.pointerMoveCallbacks) {
			callback = this.pointerMoveCallbacks[key];
			if (callback) {
				var result = callback(_game, x, y, _child);

				// if return true interrupt the process
				if (result) {
					_game.debug
							.log('event consumed - interrupt processing of pointermove (2)');
					return true;
				}
			}
		}
	};

	// control drag and drop
	this.pointerDownCallbacks.push(function(_game, x, y, _child) {
		_child.dragX = x;
		_child.dragY = y;

		if (_child.isDraggable) {
			_child.isDragging = true;
		}
		return true;
	});

	this.drag = function(_game, x, y, _child) {

		if (this.debug) {
			_game.debug.log('moved ' + x + '/' + y + ' drag:'
					+ _child.isDraggable + ' dragging:' + _child.isDragging
					+ ' id:' + _child.id);
		}

		if (_child.isDraggable && _child.isDragging) {
			_child.x = _child.x + (x - _child.dragX);
			_child.y = _child.y + (y - _child.dragY);
			_child.dragX = x;
			_child.dragY = y;
			return true;
		}
	};

	/**
	 * should be override by implementation
	 */
	this.beforeUpdate = function(_game, _scene, current) {
		// empty
	}
	
	this.update = function(_game, _scene, current) {
		this.beforeUpdate(_game, _scene, current);
		
		if( this.width < 1 || this.height < 1 ){
			_game.debug.warn('update of not loaded : ' 
			+ this.id + ' ' + this.width + ' ' + this.height );
			return;
		}
		
		if( this.fixed ){
			var ctx = _game.ctx;
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = this.border;
			ctx.fillStyle = this.fillColor;
			
			var _x = this.x;
			var _y = this.y;
			
			ctx.beginPath();
			ctx.moveTo( _x, _y);
			ctx.lineTo( _x + this.width, _y);
			ctx.lineTo( _x + this.width, _y + this.height);
			ctx.lineTo( _x, _y + this.height);
			ctx.lineTo( _x, _y );
	
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		
		} else {
			if( this.intersects(_game.viewport.x, _game.viewport.y,
				_game.viewport.width, _game.viewport.height ) ){
				
				var ctx = _game.ctx;
				ctx.strokeStyle = this.borderColor;
				ctx.lineWidth = this.border;
				ctx.fillStyle = this.fillColor;
				
				var _x = this.x - _game.viewport.x;
				var _y = this.y - _game.viewport.y;
				
				ctx.beginPath();
				ctx.moveTo( _x, _y);
				ctx.lineTo( _x + this.width, _y);
				ctx.lineTo( _x + this.width, _y + this.height);
				ctx.lineTo( _x, _y + this.height);
				ctx.lineTo( _x, _y );
		
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			} 
		}
	};

	this.has = function has(x, y) {
		return (x > this.x) && (y > this.y) && (x < this.x + this.width)
				&& (y < this.y + this.height);
	};

	this.intersects = function(x1, y1, width1, height1) {

		var x2 = this.x;
		var y2 = this.y;
		var width2 = this.width;
		var height2 = this.height;

		return !((x2 > (x1 + width1)) || (x1 > (x2 + width2))
				|| (y2 > (y1 + height1)) || (y1 > (y2 + height2)));

	};

}