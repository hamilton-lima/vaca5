/**
 * @class Transition
 * @return
 */
function Transition(_nextScene) {

	this.nextScene = _nextScene;
	this.previousScreen = null;
	this.nextScreen = null;

	this.ready = false;
	this.finished = false;
	this.steps = 0;
	this.currentStep = 1;
	this.speed = 15;
	this.expectedFPS = 60;

	this.effectFunction = null;
	this.EFFECT_SLIDE_LEFT = 1;
	this.EFFECT_SLIDE_RIGHT = 2;
	this.EFFECT_SLIDE_TOP = 3;
	this.EFFECT_SLIDE_DOWN = 4;
	this.EFFECT_SLIDE_FADE = 5;
	this.effect = this.EFFECT_SLIDE_LEFT;

	/**
	 * there is a bug with firefox:
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=564332
	 */
	this.update = function(_game, current) {
		if (current.effectFunction) {
			current.effectFunction(_game, current);
		}
	};

	/**
	 * initial setup of the transition
	 */
	this.start = function(_game, current) {

		// capture the current screen
		if (!current.previousScreen) {
			var data = _game.ctx.getImageData(0, 0, _game.width, _game.height);

			current.previousScreen = document.createElement('canvas');
			current.previousScreen.width = _game.width;
			current.previousScreen.height = _game.height;
			var localContext = current.previousScreen.getContext('2d');
			localContext.putImageData(data, 0, 0);
		}

		if (!current.nextScreen) {
			// save the first next scene screen
			current.nextScreen = document.createElement('canvas');
			current.nextScreen.width = _game.width;
			current.nextScreen.height = _game.height;

			var currentCtx = _game.ctx;
			_game.ctx = current.nextScreen.getContext('2d');

			// start the next scene
			current.nextScene.start(_game);
			current.nextScene.update(_game);

			// restore game context
			_game.ctx = currentCtx;
		}

		current.ready = true;

		if (current.effect == current.EFFECT_SLIDE_LEFT) {
			current.effectFunction = _effectSlideLeft;
			current.steps = _game.width;
		}

		if (current.effect == current.EFFECT_SLIDE_RIGHT) {
			current.effectFunction = _effectSlideRight;
			current.steps = _game.width;
		}

		if (current.effect == current.EFFECT_SLIDE_TOP) {
			current.effectFunction = _effectSlideTop;
			current.steps = _game.height;
		}

		if (current.effect == current.EFFECT_SLIDE_DOWN) {
			current.effectFunction = _effectSlideDown;
			current.steps = _game.height;
		}

		if (current.effect == current.EFFECT_FADE) {
			current.effectFunction = _effectFade;
			current.steps = _game.height;
		}
	};

}

function _effectSlideLeft(_game, current) {

	if (current.ready && !current.finished) {
		var x1 = -current.currentStep;
		var x2 = _game.width - current.currentStep;
		var localSpeed = current.speed * (current.expectedFPS / _game.lastFPS);

		// effect to shift left
		_game.ctx.drawImage(current.previousScreen, x1, 0);
		_game.ctx.drawImage(current.nextScreen, x2, 0);
		current.currentStep += localSpeed;
	}

	if (current.currentStep > current.steps) {
		current.finished = true;
	}

}

function _effectSlideRight(_game, current) {

	if (current.ready && !current.finished) {
		var x1 = current.currentStep;
		var x2 = -_game.width + current.currentStep;
		var localSpeed = current.speed * (current.expectedFPS / _game.lastFPS);

		_game.ctx.drawImage(current.previousScreen, x1, 0);
		_game.ctx.drawImage(current.nextScreen, x2, 0);
		current.currentStep += localSpeed;
	}

	if (current.currentStep > current.steps) {
		current.finished = true;
	}
}

function _effectSlideTop(_game, current) {

	if (current.ready && !current.finished) {
		var y1 = current.currentStep;
		var y2 = -_game.height + current.currentStep;
		var localSpeed = current.speed * (current.expectedFPS / _game.lastFPS);

		_game.ctx.drawImage(current.previousScreen, 0, y1);
		_game.ctx.drawImage(current.nextScreen, 0, y2);
		current.currentStep += localSpeed;
	}

	if (current.currentStep > current.steps) {
		current.finished = true;
	}
}

function _effectSlideDown(_game, current) {

	if (current.ready && !current.finished) {
		var y1 = -current.currentStep;
		var y2 = _game.height - current.currentStep;
		var localSpeed = current.speed * (current.expectedFPS / _game.lastFPS);

		_game.ctx.drawImage(current.previousScreen, 0, y1);
		_game.ctx.drawImage(current.nextScreen, 0, y2);
		current.currentStep += localSpeed;
	}

	if (current.currentStep > current.steps) {
		current.finished = true;
	}
}

function _effectFade(_game, current) {

	if (current.ready && !current.finished) {

		var half = (current.steps / 2);

		// first part
		if (current.currentStep < half) {
			var alpha = current.currentStep / half;
			_game.ctx.drawImage(current.previousScreen, 0, 0);
			_game.ctx.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
			_game.ctx.fillRect(0, 0, _game.width, _game.height);
		} else {
			var alpha = 1 - ((current.currentStep - half) / half);
			// second part
			_game.ctx.drawImage(current.nextScreen, 0, 0);
			_game.ctx.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
			_game.ctx.fillRect(0, 0, _game.width, _game.height);
		}

		var localSpeed = current.speed * (current.expectedFPS / _game.lastFPS);
		current.currentStep += localSpeed;
	}

	if (current.currentStep > current.steps) {
		current.finished = true;
	}
}
