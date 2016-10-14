// create grid cell that mix rectangle and label

/**
 * @class Grid
 * @param _x
 * @param _y
 * @param _id
 * @param _text
 * @return
 */
function Grid(_id, _x, _y, _width, _height, _lines, _columns, _border) {

	this.from = GridLayout;
	this.from();

	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	this.lines = _lines;
	this.columns = _columns;
	this.border = _border;
	this.fontSize = 12;
	
	this.setHeaderColor = NMSColor.FENNEL;
	this.setDataColor = NMSColor.ENDIVE;
	
	this.id = _id;
	
	/**
	 * _data must have nodes header/data
	 * header must be an array of strings
	 * and data an array of array of strings
	 * 
	 * @param _data
	 * @return
	 */
	this.setData = function(_game, current, _data){
		var headerArray = _data['header'];
		var dataArray = _data['data'];
		
		if( !headerArray || !dataArray ){
			_game.debug.error('no data or header was set');
		} else {
			
			for(key in headerArray){
				var foo = new Label(0,0, 'header_' + key, headerArray[key]);
				foo.size = this.fontSize;
				foo.backgroundColor = current.setHeaderColor;
				current.add( foo );
			}

			for(key in dataArray){
				for(innerKey in dataArray[key]){
					var label = new Label(0,0, 'data_' + key + '_' + innerKey, dataArray[key][innerKey]);
					label.backgroundColor = current.setDataColor;
					label.size = this.fontSize;
					current.add( label );
				}
			}
		}
		
	};
	

}
