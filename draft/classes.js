// super classe
function Ball(){
	
	// atributo
	this.width = 10;

	// metodo
	this.fly = function(){
		this.width += 20;
	};

	// metodo com parametro
	this.setWidth = function(_width){
		this.width = _width;
	};
}

// subclasse
function Ball2(){
	
	// mecanismo para determinar heranca
	this.from = Ball;
	this.from();
	
	// novo atributo da subclasse
	this.name = 'foo';
}

var a = new Ball2();
a.fly();

document.write(a.width);
a.setWidth(45);
document.write('<br>' + a.width );
document.write('<br>' + a.name );

