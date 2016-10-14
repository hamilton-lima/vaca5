

function ResourceManager() {

	this.images = new Array();
	this.sounds = new Array();
	this.active = false;

	this.imagesCallbacks = new Array();
	this.soundsCallbacks = new Array();
	this.interval = 50;

	/**
	 * 
	 * @return image resources loading percentage
	 */
	this.percentage = function(){

		var lasting = 0;
		for(key in _resourceManager.imagesCallbacks){
			lasting ++;
		}
		
		var total = 0;
		for(key in _resourceManager.images){
			total ++;
		}
		
		var current = total - lasting;
		var percentage = current / total;
		
		if( total == 0 ){
			percentage = 0;
		}
		
		return percentage;
	};
	

	/**
	 * @param src,
	 *            the image source name
	 * @param callback,
	 *            the object that will receive the call of the method
	 *            callback(object,image); when the onload is triggered.
	 */
	this.addImage = function(src, callback) {
				
		var _image = new Image();
		_image.src = src;

		if (!this.imagesCallbacks[src]) {
			this.imagesCallbacks[src] = new Array();
		}

		this.imagesCallbacks[src].push(callback);
		this.images[src] = _image;

		if (!this.active) {
			this.active = true;
			_resourceManager_update();
		}

	};

}

var _resourceManager = new ResourceManager();

function _resourceManager_update() {

	for (src in _resourceManager.images) {

		var callbacks = _resourceManager.imagesCallbacks[src];
		if (callbacks) {

			if (_resourceManager.images[src].complete 
				&& _resourceManager.images[src].width > 0				
				&& _resourceManager.images[src].height > 0 ) {

				for (target in callbacks) {
					var _target = callbacks[target];
					_target.callback(_target, _resourceManager.images[src]);
				}
				delete _resourceManager.imagesCallbacks[src];
			}
		}
	}
	
	var count = 0;
	for(key in _resourceManager.imagesCallbacks){
		count ++;
	}

	if (count > 0) {
		setTimeout(_resourceManager_update, _resourceManager.interval);
	} else {
		_resourceManager.active = false;
	}
}
