function DebugMessage(_level, _text){
	this.level = _level;
	this.text = _text;
}

/**
 * @class Debug
 * @param divName
 * @return
 */
function Debug(divName) {

	this.ERROR = 1;
	this.WARN = 2;
	this.LOG = 3;
	this.INFO = 4;
	
	this.limit = 15;
	this.debugDiv = document.getElementById(divName);
	this.messages = new Array();
	this.level = this.WARN;

	this.error = function(_text) {
		this.addMessage(this.ERROR,_text);
	};
	
	this.warn = function(_text) {
		this.addMessage(this.WARN,_text);
	};

	this.log = function(_text) {
		this.addMessage(this.LOG,_text);
	};

	this.info = function(_text) {
		this.addMessage(this.INFO,_text);
	};

	this.addMessage = function(_level, _text) {
		if( this.level < _level ){
			return;
		}
		
		var message = new DebugMessage(_level, _text);
		this.messages.unshift(message);
		this.show();
	};
	
	this.levelLabel = function(_level){
		var result = '#N/D';
		switch(_level){
		case 1:
			  result = 'ERROR';
			  break;
		case 2:
			  result = 'WARN';
			  break;
		case 3:
			  result = 'LOG';
			  break;
		case 4:
			  result = 'INFO';
			  break;
		}
		
		return result;
	};
	
	this.show = function() {

		if (this.messages.length > this.limit) {
			this.messages.pop();
		}

		if (this.debugDiv) {
			var tempString = '<b>debug</b><br>';
			for (key in this.messages) {
				var message = this.messages[key];
				if( this.level >= message.level ){
					tempString += this.levelLabel(message.level) +' '+ message.text+ '<br>';
				}
			}
			this.debugDiv.innerHTML = tempString;
		}
	};
	
	
}

function ShowAllPressedKeys() {

	this.update = function(_game) {
		var lastKeyTemp = '>';
		for (key in _game.keyPressed) {
			if (_game.keyPressed[key]) {
				lastKeyTemp += key + ' ';
			}
		}

		_game.ctx.strokeText(lastKeyTemp, 10, 200);
	};
}

function ShowViewPort(){
	this.update = function(_game) {
		_game.debug.warn('viewport : ' + _game.viewport.x + '/'+ _game.viewport.y );
	}
}

