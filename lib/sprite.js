/**
 * @class Sprite
 * @param _id
 * @param _x
 * @param _y
 * @param _width
 * @param _height
 * @param _src
 * @return
 */
function Sprite(_id, _x, _y, _src) {

	this.from = Rectangle;
	this.from();

	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.src = _src;
	
	this.DEFAULT_STATE = '__sds__';
	this.frames = 4;
	this.current_frame = 0;
	this.position = 0;
	this.state = this.DEFAULT_STATE;
	
	// avoid variable declaration inside the update
	this.__image = null;	
	this.__image_name = null;
	
	this.states = new Array();
	this.states[this.DEFAULT_STATE] = new Array();
	this.states[this.DEFAULT_STATE][this.states[this.DEFAULT_STATE].length] = _src;

	this.callback = function(myself, image) {
		myself.width = image.width;
		myself.height = image.height;
	};

	this.setState = function(_state){
		this.state = _state;
		this.position = 0;
		this.current_frame = 0;
	}

	this.addState = function(_state, _image_name){
		if( ! this.states[_state] ){
			this.states[_state] = new Array();
		}
		
		this.states[_state][this.states[_state].length] = _image_name;
		_resourceManager.addImage(_image_name, this);
		
	}
	
	// use this to animate drawing parts of the image
	// context . drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
	//
	this.update = function(_game, _scene, current) {
		current.beforeUpdate(_game, _scene, current);
		
		this.current_frame ++;
		if( this.current_frame > this.frames ){
			this.position = (this.position +1) % this.states[this.state].length;
			this.current_frame = 0;
		}
	
		this.__image_name = this.states[this.state][this.position];
		this.__image = _resourceManager.images[this.__image_name];
		
		if( this.__image.complete && this.__image.width > 0 && this.__image.height > 0 ){
		
			if( this.fixed ){
				var _x = this.x;
				var _y = this.y;
				
				_game.ctx.drawImage(this.__image, _x, _y, this.__image.width, this.__image.height);
			
			} else {
				if( this.intersects(_game.viewport.x, _game.viewport.y,
					_game.viewport.width, _game.viewport.height ) ){
		
					var _x = this.x - _game.viewport.x;
					var _y = this.y - _game.viewport.y;
					
					_game.ctx.drawImage(this.__image, _x, _y, 
						this.__image.width, this.__image.height);

				} 
			}		
		
		
		} else {
			_game.debug.warn('update of sprite not ready : ' 
				+ this.id + ' : ' + this.__image_name );
			return;
		}

	};

	_resourceManager.addImage(_src, this);

}