function ViewportManager(_target,_left,_right,_top,_bottom) {

	this.followTarget = _target;
	this.leftLimit = _left;
	this.rightLimit = _right;
	this.topLimit = _top;
	this.bottomLimit = _bottom;

	/**
	* try to set the followtarget in the middle of the screen
	* calculate the necessary shift to move to this position
	* and check if can move in that direction
	*/
	this.update = function(_game) {
	
		if( this.followTarget.width <= 0 || this.followTarget.height <= 0
			|| this.leftLimit.width <= 0 || this.leftLimit.height <= 0 			
			|| this.rightLimit.width <= 0 || this.rightLimit.height <= 0 			
			|| this.topLimit.width <= 0 || this.topLimit.height <= 0 			
			|| this.bottomLimit.width <= 0 || this.bottomLimit.height <= 0 ){
			
			_game.debug.warn('progress bar update with not ready objects.');
			return;
		}
	
		var x = this.followTarget.x - ((_game.viewport.width - this.followTarget.width )/2 );
		var y = this.followTarget.y - ((_game.viewport.height - this.followTarget.height )/2);		

		_game.viewport.x = x;
		_game.viewport.y = y;
		
		// check the colision with the limits to restrict the viewport movement
		
		// check right colision
		if( this.rightLimit.intersects(_game.viewport.x, _game.viewport.y,
			_game.viewport.width, _game.viewport.height ) ){
			_game.viewport.x = this.rightLimit.x - _game.viewport.width;
		}

		// check left colision
		if( this.leftLimit.intersects(_game.viewport.x, _game.viewport.y,
			_game.viewport.width, _game.viewport.height ) ){
			_game.viewport.x = this.leftLimit.x + this.leftLimit.width;
		}


		// check top colision
		if( this.topLimit.intersects(_game.viewport.x, _game.viewport.y,
			_game.viewport.width, _game.viewport.height ) ){
			_game.viewport.y = this.topLimit.y + this.topLimit.height;
		}

		// check bottom colision
		if( this.bottomLimit.intersects(_game.viewport.x, _game.viewport.y,
			_game.viewport.width, _game.viewport.height ) ){
			_game.viewport.y = this.bottomLimit.y - _game.viewport.height;
		}

	};
	
}

