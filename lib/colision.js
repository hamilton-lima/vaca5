function ColisionManager() {

	this.sizeX = 10;
	this.sizeY = 10;
	this.handlers = new Array();

	this.regions = new Array(10);
	for ( var n = 0; n < this.sizeX; n++) {
		this.regions[n] = new Array(this.sizeY);
		for ( var m = 0; m < this.sizeY; m++) {
			this.regions[n][m] = new Array();
		}
	}

	/**
	 * @beta
	 */
	this.add = function(object) {
		object.regionX = Math.floor(object.x) % this.sizeX;
		object.regionY = Math.floor(object.y) % this.sizeY;

		object.regionX1 = Math.floor(object.x + object.width) % this.sizeX;
		object.regionY1 = Math.floor(object.y + object.height) % this.sizeY;

		if (object.regionX <= 0) {
			object.regionX = 0;
		}

		if (object.regionY <= 0) {
			object.regionY = 0;
		}

		game.debug.log('regions ' + object.regionX + ' ' + object.regionY + ' '
				+ object.x + ' ' + object.y);

		this.regions[object.regionX][object.regionY].push(object);
	};


	/**
	 * @beta
	 */
	this.move = function(object) {

		// remove from the list
		for (key in this.regions[object.regionX][object.regionY]) {
			if (object.id == this.regions[object.regionX][object.regionY][key].id) {
				delete this.regions[object.regionX][object.regionY][key];
				break;
			}
		}

		this.add(object);
	};

	// dispatch the colision for the listeners
	this.colide = function(_game, _a, _b) {

		for (key in this.handlers) {
			handler = this.handlers[key];
			var result = handler(_game, _a, _b);
			if (result) {
				_game.debug.log('colision processing interrupted.');
				return true;
			}
		}
	};

	this.update = function(_game) {
		this.checkColision(_game);
	};

	/**
	 * brute force colision check
	 * @beta
	 */
	this.checkColision2 = function(_game) {

		var childs = _game.currentScene.childs;
		for ( var n = 0; n < childs.length; n++) {
			if (childs[n].isColidable) {

				// get the neighbours
				var neighb1 = this.regions[childs[n].regionX][childs[n].regionY];
				for (key in neighb1) {
					if (neighb1[key].id != childs[n].id) {
						if (neighb1[key].isColidable) {
							if (childs[n].intersects(neighb1[key].x,
									neighb1[key].y, neighb1[key].width,
									neighb1[key].height)) {
								this.colide(_game, childs[n], neighb1[key]);
							}
						}
					}
				}

				// other neighbours based on the width/height
				// 1. first line
				// 2. first column
				// 3. inner regions
				for ( var m = childs[n].regionY + 1; m <= childs[n].regionY1; m++) {

					// first line
					var neighb1 = this.regions[childs[n].regionX][m];

					for (key in neighb1) {
						if (neighb1[key].id != childs[n].id) {
							if (neighb1[key].isColidable) {
								if (childs[n].intersects(neighb1[key].x,
										neighb1[key].y, neighb1[key].width,
										neighb1[key].height)) {
									this.colide(_game, childs[n], neighb1[key]);
								}
							}
						}
					}
				}

				// first column
				for ( var m = childs[n].regionX + 1; m <= childs[n].regionX1; m++) {

					// first line
					var neighb1 = this.regions[m][childs[n].regionY];

					for (key in neighb1) {
						if (neighb1[key].id != childs[n].id) {
							if (neighb1[key].isColidable) {
								if (childs[n].intersects(neighb1[key].x,
										neighb1[key].y, neighb1[key].width,
										neighb1[key].height)) {
									this.colide(_game, childs[n], neighb1[key]);
								}
							}
						}
					}
				}

				for ( var m = childs[n].regionY + 1; m <= childs[n].regionY1; m++) {
					for ( var j = childs[n].regionX + 1; j <= childs[n].regionX1; j++) {

						// first line
						var neighb1 = this.regions[j][m];

						for (key in neighb1) {
							if (neighb1[key].id != childs[n].id) {
								if (neighb1[key].isColidable) {
									if (childs[n].intersects(neighb1[key].x,
											neighb1[key].y, neighb1[key].width,
											neighb1[key].height)) {
										this.colide(_game, childs[n],
												neighb1[key]);
									}
								}
							}
						}
					}
				}

			} // if colidable

		} // for all the elements

	};

	/**
	 * brute force colision check
	 */
	this.checkColision = function(_game) {

		var childs = _game.currentScene.childs;
		for ( var n = 0; n < childs.length; n++) {
			if (childs[n].isColidable) {

				// all the childs before the current
				var before1 = 0;
				var before2 = n - 1;
				for ( var i = before1; i < before2; i++) {
					if (childs[i].isColidable) {
						if (childs[n].intersects(childs[i].x, childs[i].y,
								childs[i].width, childs[i].height)) {
							this.colide(_game, childs[n], childs[i]);
						}
					}
				}

				// all the childs after the current
				var after1 = n + 1;
				var after2 = childs.length;
				for ( var i = after1; i < after2; i++) {
					if (childs[i].isColidable) {
						if (childs[n].intersects(childs[i].x, childs[i].y,
								childs[i].width, childs[i].height)) {
							this.colide(_game, childs[n], childs[i]);
						}
					}
				}
			}

		}

	};

	/**
	* check colision from one target
	*/
	this.listColision = function(_game, _target) {

		var coliders = new Array();
		var childs = _game.currentScene.childs;
		
		for ( var n = 0; n < childs.length; n++) {
			if (childs[n].isColidable) {
				if (childs[n].id != _target.id 
					&& childs[n].intersects(_target.x, _target.y,
						_target.width, _target.height)) {
							
					coliders.push( childs[n] );
				}
			}				
		}

		return coliders;

	};

	/**
	* check colision from positions
	*/
	this.listColision = function(_game, id, x, y, width, height) {

		var coliders = new Array();
		var childs = _game.currentScene.childs;
		
		for ( var n = 0; n < childs.length; n++) {
			if (childs[n].isColidable) {
				if (childs[n].id != id 
					&& childs[n].intersects(x, y, width, height)) {
					coliders.push( childs[n] );
				}
			}				
		}

		return coliders;

	};

}