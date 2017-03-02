"use strict";

/*
                     /$$             /$$    
                    |__/            | $$    
  /$$$$$$   /$$$$$$  /$$ /$$$$$$$  /$$$$$$  
 /$$__  $$ /$$__  $$| $$| $$__  $$|_  $$_/  
| $$  \ $$| $$  \ $$| $$| $$  \ $$  | $$    
| $$  | $$| $$  | $$| $$| $$  | $$  | $$ /$$
| $$$$$$$/|  $$$$$$/| $$| $$  | $$  |  $$$$/
| $$____/  \______/ |__/|__/  |__/   \___/  
| $$                                        
| $$                                        
|__/  

*/

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `(${this.x}; ${this.y})`;
	}
}

class Line {
	constructor (point1, point2) {
		this.start = point1;
		this.end = point2;
	}
}

class Exis extends Line {
	constructor(options) {
		this.startPoint = options.startPoint;
		this.endPoint = options.endPoint;
	} 
}

class Arrow {

	// options: ctx, startX, startY, width, height, arcR, rotateAngel
	constructor(option) {
		this.ctx = option.ctx;
		this.startX = option.startX;
		this.startY = option.startY;
		this.width = option.width;
		this.height = option.height;
		this.arcR = option.arcR || 40;
		this.rotateAngel = option.rotateAngel || 0;
	}

	draw() {
	  let 
	  	ctx = this.ctx,
	  	startX = this.startX,
	  	startY = this.startY,
	  	width = this.width,
	  	height = this.height,
	  	arcR = this.arcR,
	  	rotateAngel =  this.rotateAngel;

	  ctx.save();
	  ctx.beginPath();
	  ctx.translate(startX + width / 2, startY);
	  ctx.rotate(rotateAngel * Math.PI / 180);
	  ctx.translate(-(startX + width / 2), -startY);

	  
	  ctx.moveTo(startX + width, startY);
	  ctx.lineTo(startX, startY - height / 2);
	  ctx.arcTo(startX + width, startY, startX, startY + height / 2, arcR);
	  ctx.lineTo(startX, startY + height / 2);
	  ctx.stroke();
	  ctx.fill();
	  ctx.closePath();
	  ctx.restore();
	}
}

class CoordinateSystem {
	constructor(option) {
		this.ctx = option.ctx;
		this.minX = option.minX || 0;
		this.maxX = option.maxX || 0;
		this.minY = option.minY || 0;
		this.maxY = option.maxY || 0;
		this.offset = option.offset || 0;
		this.color = option.color || '#000';

		this.width = this.ctx.canvas.clientWidth;
		this.height = this.ctx.canvas.clientHeight;

		// кількість поділок які треба поставити на вісі Х
		this.xExisPointsCount = Math.abs(this.minX) + Math.abs(this.maxX) + 1;
		this.yExisPointsCount = Math.abs(this.minY) + Math.abs(this.maxY) + 1;

		// відступи між поділками
		this.marginX = Math.floor( this.width / this.xExisPointsCount);
		this.marginY = Math.floor( this.height / this.yExisPointsCount);


		//  шукаємо позицію нуля на канвасі
		let 
			x = this.offset + (Math.abs(this.minX) + Math.abs(this.maxX)) / 2 * this.marginX,
			y = this.offset + (Math.abs(this.minY) + Math.abs(this.maxY)) / 2 * this.marginY;


		this.zero = new Point(x, y);

		let 
			start = new Point(this.offset, this.zero.y),
			end = new Point(this.width - this.offset, this.offset);

		this.xExis = new Line(start, end);

		start = new Point(this.zero.x, this.offset),
		end = new Point(this.zero.x, this.height - this.offset);

		this.yExis = new Line(start, end);
	}

	draw() {
		// // кількість поділок які треба поставити на вісі Х
		// let xExisPointsCount = Math.abs(this.minX) + Math.abs(this.maxX) + 1;
		// let yExisPointsCount = Math.abs(this.minY) + Math.abs(this.maxY) + 1;
		// console.log(yExisPointsCount, Math.abs(this.minY), this.minY);

		// let width = this.ctx.canvas.clientWidth;
		// let height = this.ctx.canvas.clientHeight;

		// let marginX = Math.floor( width / xExisPointsCount);
		// let marginY = Math.floor( height / yExisPointsCount);

		// draw x exis
		this.ctx.save();

		// перевертаємо систему координат
		this.ctx.translate(0, this.width);
		this.ctx.scale(1, -1);

		this.ctx.beginPath();

		// draw x exis
		this.ctx.moveTo(this.startXPos, this.startYPos);
		this.ctx.lineTo(this.width - this.offset, this.offset);
		this.ctx.stroke();

		new Arrow({
			ctx: this.ctx,
			startX: this.startXPos - 10,
			startY: this.offset,
			width: 20,
			height: 20,
			arcR: 10
		}).draw();

		// draw y exis
		this.ctx.moveTo(this.zero.x, this.offset);
		this.ctx.lineTo(this.zero.x, this.height - this.offset);
		this.ctx.stroke();

		new Arrow({
			ctx: this.ctx,
			startX: this.zero.x - 10,
			startY: this.height - this.offset,
			width: 20,
			height: 20,
			arcR: 10,
			rotateAngel: 90
		}).draw();

		this.ctx.closePath();
		this.ctx.restore();

		// малюємо поділки на осі X
		for(let i = 0; i < this.xExisPointsCount - 1; i++) {
			let margin = i * this.marginX;

			this.ctx.moveTo(this.offset + margin, this.height - this.offset - 5);
			this.ctx.lineTo(this.offset + margin, this.height - this.offset + 5);
			this.ctx.stroke();

			this.ctx.font = '16px arial';

			let 
				textWidth = this.ctx.measureText(this.minX + i).width,
				textHeight = parseInt(this.ctx.font);

			this.ctx.fillText(this.minX + i, this.offset + margin - 5,  this.height - this.offset + textHeight + textHeight / 2);

		}

		// малюємо поділки на осі Y
		for(let i = 0; i <= this.yExisPointsCount; i++) {
			let margin = i * this.marginY;

			this.ctx.moveTo(this.offset - 5, this.offset + this.margin);
			this.ctx.lineTo(this.offset + 5, this.offset + this.margin);
			this.ctx.stroke();
		}
	}

	_drawArrow() {}
}

/*
                                           /$$     /$$                    
                                          | $$    |__/                    
  /$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$ 
 /$$__  $$ /$$__  $$| $$  | $$ |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
| $$$$$$$$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
| $$_____/| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
|  $$$$$$$|  $$$$$$$|  $$$$$$/|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
 \_______/ \____  $$ \______/  \_______/   \___/  |__/ \______/ |__/  |__/
                | $$                                                      
                | $$                                                      
                |__/                                                      
*/

class Equation {
	// "ax1 + ax2 + c = d"
	constructor(a, b, c, operation, d) {
		this.a = Number(a) || 0;
		this.b = Number(b) || 0;
		this.c = Number(c) || 0;
		this.operation = operation || '=';
		this.eq = Number(d) || 0;
	}

	draw(ctx) {
		if (a != 0 && b != 0) {
			let p1 = new Point(solve(this.b, this.c, this.d), solve(this.a, this.c, this.d));
		}
	}

	// ax + b = c 
	solve(a, b, c) {
		return (c - b) / a;
	}

	toString() {
		let result = `${this.a}x1`;

		if (this.b > 0)
			result += ` + ${this.b}x2`;
		else
			result += ` - ${Math.abs(this.b)}x2`;

		if (this.c > 0)
			result += ` + ${this.c}`;
		else 
			result += ` - ${Math.abs(this.c)}`;

		result += ` ${this.operation} ${this.eq}`;

		return result;
	}
}