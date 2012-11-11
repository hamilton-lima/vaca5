/**
 * @class Label
 * @param _x
 * @param _y
 * @param _id
 * @param _text
 * @return
 */
function Label(_x, _y, _id, _text) {

	this.from = Rectangle;
	this.from();

	this.x = _x;
	this.y = _y;
	this.id = _id;
	this.text = _text;
	this.size = 20;
	this.font = 'Helvetica';
	this.debug = false;
	this.invalid = true;

	this.innerBorder = 2;
	this.align = 'center';
	this.valign = 'center';
	
	this.textWidth = null;
	this.textHeight = null;	

	this.fillColor = NMSColor.EGGPLANT;
	this.borderColor = NMSColor.BLUEBERRY;
	this.backgroundColor = null;
	
	this.border = 1;

	/**
	 * activate debug mode of the label, show a rectangle around the label
	 */
	this.setDebug = function(_bool) {
		this.debug = _bool;
	};	
	
	/**
	 * change the text and recalculate the dimensions
	 */
	this.setText = function(_text) {
		this.text = _text;
		this.invalid = true;
	};
	
	this.calculateMetrics = function(_game){
		_game.ctx.font = this.size + 'px ' + this.font;
		_game.ctx.textBaseline = 'top';
		var metrics = _game.ctx.measureText(this.text);
		this.textWidth = metrics.width;
		this.textHeight = this.size;
		
		if( ! this.width ){
			this.width = this.textWidth;
		}		
		
		if( ! this.height ){
			this.height = this.textHeight;
		}
		
		if (this.debug) {
			_game.debug.log(this.id + ' font bounding box : ' + this.width
					+ '/' + this.height);
		}

	};
	
	this.start = function(_game) {
		this.calculateMetrics(_game);
	};
	
	
	this.beforeUpdate = function(_game, _scene, current){
		
	};
	
	this.update = function(_game, _scene, current) {
		this.beforeUpdate(_game, _scene, current);
		
		if( this.width <= 0 || this.height <= 0 ){
			_game.debug.warn('update of not loaded : ' + this.id );
			return;
		}
		
		if( this.invalid ){
			this.calculateMetrics(_game);
		}

		var ctx = _game.ctx;

		if( current.backgroundColor ){
			_game.ctx.fillStyle = current.backgroundColor;
			_game.ctx.beginPath();
			_game.ctx.rect(this.x, this.y, this.width, this.height);
			_game.ctx.closePath();
			_game.ctx.fill();	
		}
		
		ctx.strokeStyle = this.borderColor;
		ctx.lineWidth = this.border;
		ctx.fillStyle = this.fillColor;

		ctx.textBaseline = 'top';
		ctx.font = this.size + 'px ' + this.font;
		
		var localX = this.x;
		var localY = this.y;
		
		if( this.align == 'center'){
			localX = localX + ((this.width - this.textWidth ) /2 );
		} else {
			localX = localX + this.innerBorder;
		}
		
		if( this.valign == 'center'){
			localY = localY + ((this.height - this.textHeight ) /2 );
		} else {
			localY = localY + this.innerBorder;
		}
		
		if( this.fixed ){
			ctx.fillText(this.text, localX, localY);
			
			if (this.debug) {
				ctx.strokeRect(localX, localY, this.width, this.height);
			}
			
		} else {
			if( this.intersects(_game.viewport.x, _game.viewport.y,
				_game.viewport.width, _game.viewport.height ) ){
	
				localX -= _game.viewport.x;
				localY -= _game.viewport.y;
				
				ctx.fillText(this.text, localX, localY);
				
				if (this.debug) {
					ctx.strokeRect(localX, localY, this.width, this.height);
				}
			} 
		}
		// ctx.strokeText(this.text, this.x, this.y);
		
	};

}
