/**
 * @class Scene
 * @param _width
 * @param _height
 * @return
 */
function Scene(_width,_height){
	
	this.x = 0;
	this.y = 0;
	
	this.width = _width;
	this.height = _height;
	
	this.childs = new Array();
	this.background = '#000000';
	
	this.pointerDownCallbacks = new Array();
	this.pointerUpCallbacks = new Array();
	this.pointerMoveCallbacks = new Array();
	
	this.transition = null;
	
	// trigger clicks on scene childs
	this.pointerDownCallbacks.push(function(_game, x, y) {
		
		var childs = _game.currentScene.childs;
		
		for(var n = childs.length-1; n >=0; n--){
			if( childs[n].has && childs[n].has(x,y)){
				// when event is consumed the method returns true.
				if( childs[n].pointerDown(_game,x,y,childs[n])){
					break;
				}
			}
		}
	});
	
	this.pointerUpCallbacks.push(function(_game, x, y) {
		
		var childs = _game.currentScene.childs;
		
		for(var n = childs.length-1; n >=0; n--){
			if( childs[n].has && childs[n].has(x,y)){
				// when event is consumed the method returns true.
				if( childs[n].pointerUp(_game,x,y,childs[n])){
					break;
				}
			}
		}

		// release the mouse on all childrens
		for(key in childs){
			child = childs[key]; 
			child.isDragging = false;
		}
	});
	
	this.pointerMoveCallbacks.push(function(_game, x, y) {
		
		var childs = _game.currentScene.childs;
		
		// move on dragging child
		for(key in childs){
			child = childs[key]; 
			if( child.isDragging ){
				child.drag(_game,x,y,child);
			}
		}
		
		// other mouse move events
		for(var n = childs.length-1; n >=0; n--){
			if( childs[n].has && childs[n].has(x,y)){
				// when event is consumed the method returns true.
				if( childs[n].pointerMove(_game,x,y,childs[n])){
					break;
				}
			}
		}
		
		
	});	
	
	this.beforeUpdate = function(_game, current) {
		// empty
	};	
	
	/**
	 * called by the game main loop
	 */
	this.update = function(_game, current) {
		this.beforeUpdate(_game, current);
		this.clearBackGround(_game.ctx);
		var child = null;
		for(key in this.childs){
			child = this.childs[key];
			try {
				if( child.update){
					child.update(_game, current, child);
				}
			} catch(updateError){
				_game.debug.error('error on update : ' + updateError );
			}
		}

		// childs cleanup	
		for(var n = 0; n < this.childs.length; n++){
			child = this.childs[n];
			
			if(child.remove){
				this.childs.splice(n,1);
			}
		}
		
	};

	/**
	 * call the start method of all child, if the child has start method
	 */
	this.start = function(_game) {
		_game.debug.log('scene start');
		var child = null;
		for(key in this.childs){
			child = this.childs[key]; 

			if(child.start){
				child.start(_game, child);
			}
		}
	};

	this.clearBackGround = function(ctx){
		ctx.fillStyle = this.background;
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.closePath();
		ctx.fill();		
	};
	
	this.setBackground = function(_background){
		this.background = _background;
	};
	
	this.add = function(child){
		this.childs.push(child);
	};
	
	this.findById = function(_id){
		var child = null;
		for( var key in this.childs){
			child = this.childs[key];
			if( child.id == _id ){
				return child;
			}
		}
		return null;
	};
	
	/**
	 * nickname for findById()
	 */
	this.find = this.findById;
	
}

function SceneEmpty(_width,_height){
	this.from = Scene;
	this.from();
	var label = new Label(10,30,'_title','Empty scene.');
	this.add(label);
	this.setBackground(NMSColor.BANANA);

	this.width = _width;
	this.height = _height;
}

function SceneLoading(_width, _height, _nextScene ){
	this.from = Scene;
	this.from();

	this.setBackground('#000000');	
	this.nextScene = _nextScene;
	
	var w = _width * 0.9;
	var x = (_width - w) / 2;
	var y = _height - 20;
	
	this.barWidth = w;
	
	this.start = function(_game,current) {
		var label = new Label(0,0,'_title_loading','Loading');
		label.calculateMetrics(_game);
		label.x = ( _game.width - label.width ) / 2;
		label.y = ( _game.height - label.height ) / 2; 
		
		label.fillColor = '#CCCCCC';
		label.borderColor = '#CCCCCC';

		current.add(label);	
		
		var backRect = new Rectangle('back_loading', x, y, w, 5);	
		var frontRect = new Rectangle('front_loading', x, y, 1, 5);
		
		backRect.fillColor = '#CCCCCC';
		backRect.borderColor = '#CCCCCC';
		frontRect.fillColor = NMSColor.PAPAYA;
		frontRect.borderColor = NMSColor.PAPAYA;
		
		current.add(backRect);	
		current.add(frontRect);
		
		var front = current.findById('front_loading');
		front.width = current.barWidth * _resourceManager.percentage();
	};	
	
	this.beforeUpdate = function(_game,current) {
		var front = current.findById('front_loading');
		var percent = _resourceManager.percentage();
		
		front.width = current.barWidth * percent;
		if( front.width < 1 ){
			front.width = 1;
		}
		
		if( percent >= 1 ){
			current.transition =  new Transition(current.nextScene);
			current.transition.effect = current.transition.EFFECT_FADE;
		}
	};	


	this.width = _width;
	this.height = _height;
};
