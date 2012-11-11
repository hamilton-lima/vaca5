/**
 * @class ProgressBar
 * @param _id
 * @param _x
 * @param _y
 * @param _width
 * @param _height
 * @param _position
 * @param _max
 *
 * change position to move the progress bar
 */
function ProgressBar(_id, _x, _y, _width, _height, _position, _max ) {

	this.from = Rectangle;
	this.from();
	this.superUpdate = this.update;
	
	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	this.position = _position;
	this.max = _max;
	this.defaultWidth = _width - ( 2 * this.border );

	this.frontRect = new Rectangle(_id + '_front_loading', _x + this.border, _y + this.border,
		this.defaultWidth * (_position/_max), _height - (2* this.border) );
		
	this.defaultWidth = _width - this.border;
	
	this.fillColor = '#555555';
	this.borderColor = '#555555';
	this.frontRect.fillColor = NMSColor.PAPAYA;
	this.frontRect.borderColor = NMSColor.PAPAYA;
	this.frontRect.border = 0;
	
	this.setBarColor = function(_color){
		this.frontRect.fillColor = _color;
		this.frontRect.borderColor = _color;
	}

	this.update = function(_game, _scene, current) {
		this.superUpdate(_game, _scene, current);
		
		if( this.frontRect.width <= 0 || this.frontRect.height <= 0 ){
			_game.debug.warn('update of not loaded : ' + this.id );
			return;
		}
		
		this.frontRect.fixed = this.fixed;

		this.frontRect.width = this.defaultWidth * (this.position / this.max);
		
		if( this.frontRect.width < 1 ){
			this.frontRect.width = 1;
		}
		this.frontRect.update(_game, _scene, current);
	};

}