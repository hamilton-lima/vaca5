var game = null;

/**
 * @class Game
 * @param _width
 * @param _height
 * @return
 */
function Game(_width, _height) {
	this.VERSION = '20120109-animate';
	
	this.width = _width;
	this.height = _height;

	this.debug = new Debug('debug_div');
	this.audio = new AudioManager(this);

	this.ctx = null;
	this.canvas = null;
	this.currentScene = new SceneEmpty(this.width, this.height);
	this.supportsTouch = false;
	
	this.VIEWPORT_NAME = '_viewport';
	this.viewport = new Rectangle(this.VIEWPORT_NAME, 0, 0, _width, _height);

	this.browser = null;
	this.version = null;
	this.osName = null;

	this.frameCounter = 0;
	this.lastFPS = 0;
	this.showFPS = true;
	this.fpsColor = '#000000';

	this.keyPressed = new Array();
	this.keyMapping = _defaultKeyMapping();
	this.colision = new ColisionManager();

	this.interval = 1;
	this.dt = 0;
	this.now = timestamp(); 
	this.last = timestamp();

	this.keys = new Array();
	
	/**
	 * support for language resources
	 */
	this.s = function(key,value){
		return this.keys[key];
	}

	this.def = function(key,value){
		this.keys[key] = null;
		this.keys[key] = value;
	}
	
	/**
	 * game main loop
	 * 
	 * @return
	 */
	this.update = function() {
		this.frameCounter++;

		if (!this.currentScene.transition) {
			this.colision.update(this);
			this.currentScene.update(this, this.currentScene);

			if (this.showFPS) {
				this.ctx.font = '15px helvetica';
				this.ctx.fillStyle = this.fpsColor;
				this.ctx.fillText(this.lastFPS + 'FPS', 10, 10);
			}
		} else {

			if (!this.currentScene.transition.ready) {
				this.currentScene.transition.start(this,
						this.currentScene.transition);
			} else {
				this.currentScene.transition.update(this,
						this.currentScene.transition);
			}

			// remove transition after it finishes
			if (this.currentScene.transition.finished) {
				var sceneTemp = this.currentScene;
				this.currentScene = sceneTemp.transition.nextScene;
				this.currentScene.start(this);
				sceneTemp.transition = null;
			}
		}

	};

	this.start = function() {
		this.ctx = this.canvas.getContext('2d');
		this.currentScene.start(this, this.currentScene);

		_update();
		_FPSCounter();
	};

	this.updateFPS = function() {
		this.lastFPS = this.frameCounter;
		this.frameCounter = 0;
	};

	// check the key codes based on the mapping
	// and look for the keys state in the keyPressed array
	//
	this.isKeyPressed = function(name) {

		var target = null;
		for (key in this.keyMapping) {

			var mapping = this.keyMapping[key];
			if (mapping.name == name) {
				target = mapping.keys;
				break;
			}
		}

		this.debug.log('isKeyPressed() target: ' + target);

		var result = false;
		if (target) {
			for (key in target) {
				if (this.keyPressed[target[key]]) {
					result = true;
					break;
				}
			}

		} else {
			this.debug.log('key: [' + name + '] not assigned.');
		}
		return result;
	};

}

function _keydown(e) {
	
	// disable keyboard during the transition
	if (game.currentScene.transition) {
		return;
	}

	// IE fix.
	// if(!e){ e = window.event;}
	game.keyPressed[e.keyCode] = true;
}

function _keyup(e) {
	game.keyPressed[e.keyCode] = false;
}

function timestamp() {
    return new Date().getTime();
};

function _update() {
    game.now = timestamp();
    game.dt = (game.now - game.last) / 100;

	game.update();
	game.last = game.now;

	setTimeout(_update, game.interval);
}

function _FPSCounter() {
	game.updateFPS();
	setTimeout(_FPSCounter, 1000);
}

function KeyMapping(_name, _keys) {
	this.keys = _keys;
	this.name = _name;
}

function _defaultKeyMapping() {
	var mapping = new Array();

	mapping.push(new KeyMapping('left', [ 37, 65 ]));
	mapping.push(new KeyMapping('right', [ 39, 68 ]));
	mapping.push(new KeyMapping('up', [ 38, 87 ]));
	mapping.push(new KeyMapping('down', [ 40, 83 ]));
	mapping.push(new KeyMapping('fire1', [ 13 ]));
	mapping.push(new KeyMapping('fire2', [ 32 ]));

	return mapping;
}

function initGame(_canvas, _width, _height) {

	_canvas.width = _width;
	_canvas.height = _height;

	game = new Game(_width, _height);

	BrowserDetect.init();

	game.browser = BrowserDetect.browser;
	game.version = BrowserDetect.version;
	game.osName = BrowserDetect.OS;

	window.addEventListener('keydown', _keydown, true);
	window.addEventListener('keyup', _keyup, true);

	// from http://www.html5rocks.com/mobile/touch.html
	// to disable default behaviors
	// _canvas.addEventListener('touchmove', function(event) {
	// event.preventDefault();
	// }, false);

	game.supportsTouch = 'createTouch' in document;

	_canvas.addEventListener('touchstart', _mouseDown, false);
	_canvas.addEventListener('touchmove', _mouseMove, false);
	_canvas.addEventListener('touchend', _mouseUp, false);

	_canvas.addEventListener('mousemove', _mouseMove, false);
	_canvas.addEventListener('mouseup', _mouseUp, false);
	_canvas.addEventListener('mousedown', _mouseDown, false);

	game.canvas = _canvas;
	return game;
}

function _mouseDown(e) {

	// disable mouse input during the transition
	if (game.currentScene.transition) {
		return;
	}

	var touches = getTouches(e);

	for (n in touches) {
		var p = touches[n];

		var callback = null;
		for (key in game.currentScene.pointerDownCallbacks) {
			callback = game.currentScene.pointerDownCallbacks[key];
			if (callback) {
				callback(game, p.x, p.y);
			}
		}
	}

}

function _mouseUp(e) {
	
	// disable mouse input during the transition
	if (game.currentScene.transition) {
		return;
	}

	var touches = getTouches(e);

	// on ipad there is no touches when the pointer is up
	if (touches.length <= 0) {
		for (key in game.currentScene.pointerUpCallbacks) {
			callback = game.currentScene.pointerUpCallbacks[key];
			if (callback) {
				callback(game);
			}
		}
	} else {
		for (n in touches) {
			var p = touches[n];

			var callback = null;
			for (key in game.currentScene.pointerUpCallbacks) {
				callback = game.currentScene.pointerUpCallbacks[key];
				if (callback) {
					callback(game, p.x, p.y);
				}
			}
		}
	}
}

function _mouseMove(e) {
	
	// disable mouse input during the transition
	if (game.currentScene.transition) {
		return;
	}

	var touches = getTouches(e);

	for (n in touches) {
		var p = touches[n];

		var callback = null;
		for (key in game.currentScene.pointerMoveCallbacks) {
			callback = game.currentScene.pointerMoveCallbacks[key];
			if (callback) {
				callback(game, p.x, p.y);
			}
		}
	}

	if (e.touches) {
		e.preventDefault();
	} else {
		return true;
	}
}

function getTouches(e) {

	var result = new Array();

	if (e.touches) {
		// Touch Enabled (loop through all touches)
		for ( var i = 1; i <= e.touches.length; i++) {
			var p = getCoords(e.touches[i - 1]); // Get info for finger i
			result.push(p);
		}
	} else {
		// Not touch enabled (get cursor position from single event)
		var p = getCoords(e);
		result.push(p);
	}

	return result;
}

function getCoords(e) {
	if (e.offsetX) {
		// Works in Chrome / Safari (except on iPad/iPhone)
		return {
			x : e.offsetX,
			y : e.offsetY
		};
	} else if (e.layerX) {
		// Works in Firefox
		return {
			x : e.layerX,
			y : e.layerY
		};
	} else {
		// Works in Safari on iPad/iPhone
		return {
			x : e.pageX - game.canvas.offsetLeft,
			y : e.pageY - game.canvas.offsetTop
		};
	}
}
