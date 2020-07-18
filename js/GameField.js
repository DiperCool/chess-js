import {Pawn} from "./Figures/Pawn.mjs";
import {Rook} from "./Figures/Rook.mjs";
import {Elephan} from "./Figures/Elephan.mjs";
import {Quen} from "./Figures/Quen.mjs";
import {Horse} from "./Figures/Horse.mjs"
import {King} from "./Figures/King.mjs"
export class GameField{
	constructor(){
		this.Field=[];
		this.current=null;
		this.white=[];
		this.black=[];
		for(let i=0; i<8;i++){
			this.Field[i]=[];
			for(let j=0; j<8;j++)
			{
				this.Field[i][j]={
					Figure:null,
					Looks:[],
					Attaks:[],
				};
			}
		}
		this.hod="white";
		this.figureMate=null;
		this.figures=[];
		let bR1=this.Field[0][0].Figure=new Rook(Math.random(), {y:0,x:0}, "black", this);
		let bR2=this.Field[0][7].Figure=new Rook(Math.random(), {y:0,x:7}, "black", this);
		let wR1=this.Field[7][0].Figure=new Rook(Math.random(), {y:7,x:0}, "white", this);
		let wR2=this.Field[7][7].Figure=new Rook(Math.random(), {y:7,x:7}, "white", this);



		let bE1=this.Field[0][2].Figure= new Elephan(Math.random(),{y:0,x:2}, "black", this)
		let bE2=this.Field[0][5].Figure= new Elephan(Math.random(),{y:0,x:5}, "black", this)
		let wE1=this.Field[7][2].Figure= new Elephan(Math.random(),{y:7,x:2}, "white", this)
		let wE2=this.Field[7][5].Figure= new Elephan(Math.random(),{y:7,x:5}, "white", this)

		let bQ1=this.Field[0][3].Figure=new Quen(Math.random(),{y:0,x:3}, "black",this);
		let wQ1=this.Field[7][3].Figure=new Quen(Math.random(),{y:7,x:3}, "white",this);


		let bH1=this.Field[0][1].Figure= new Horse(Math.random(),{y:0,x:1}, "black", this)
		let bH2=this.Field[0][6].Figure= new Horse(Math.random(),{y:0,x:6}, "black", this)
		let wH1=this.Field[7][1].Figure= new Horse(Math.random(),{y:7,x:1}, "white", this)
		let wH2=this.Field[7][6].Figure= new Horse(Math.random(),{y:7,x:6}, "white", this)


		let bK1=this.Field[0][4].Figure=new King(Math.random(),{y:0,x:4}, "black",this);
		let wK1=this.Field[7][4].Figure=new King(Math.random(),{y:7,x:4}, "white",this);
		for(let i=0; i<8;i++){
			let wP=this.Field[6][i].Figure=new Pawn(Math.random(),{y:6,x:i}, "white", this)
			let bP=this.Field[1][i].Figure=new Pawn(Math.random(),{y:1,x:i}, "black", this)
			this.white.push(wP)
			this.black.push(bP)
		}

		this.whiteKing=wK1;
		this.blackKing=bK1;

		this.black.push(bR1,bR2, bE1, bE2,bQ1,bH2,bH1,bK1);
		this.white.push(wR1,wR2, wE1, wE2,wQ1,wH2,wH1,wK1);
		this.figures=this.black.concat(this.white);
		this.drawField();
		this.FigureLooks();
	}

	drawField(){
		document.getElementById("d").innerHTML='';
		let plus=0;
		for(let i=0; i<8;i++){
			plus+=1;
			let chet;
			if(plus%2===0){
				chet=0;
			}
			else{
				chet=1;
			}
			for(let j=0; j<8;j++){
				let div= document.createElement("div");
				div.setAttribute("data-x",j);
				div.setAttribute("data-y",i);
				div.setAttribute("class", "field");
				div.setAttribute("style", `background: ${chet%2===0?"#94533C":"#E3BB98"}`)
				chet+=1;
				if(this.Field[i][j].Figure!==null){
					let img= document.createElement("img")
					img.setAttribute("width",79);
					img.setAttribute("heigth",79);
					img.setAttribute("data-x",j);
					img.setAttribute("data-y",i);
					img.setAttribute("src", this.Field[i][j].Figure.img);
					img.setAttribute("class", `img ${this.hod==="white"?null:"rotated"}`)
					div.appendChild(img);
				}

				document.getElementById("d").setAttribute("class", this.hod==="white"?null:"rotated")
				document.getElementById("d").appendChild(div);
				
			}
		}


		let elements=document.querySelectorAll(".field");

		for (var i = 0; i < elements.length; i++) {
			elements[i].onclick = e=>{
			  let x=Number(e.target.dataset.x);
			  let y=Number(e.target.dataset.y);
			   console.log(this.Field[y][x].Looks, "look")
			console.log(this.Field[y][x].Attaks, "attack")
			//   console.log(this.white, this.black);
			  if(this.current!==null){
				  if(this.Field[y][x].Figure!==null){
					  if(this.Field[y][x].Figure.side===this.hod){
						  this.current=this.Field[y][x].Figure;
						  return;
					  }
				  }
			  }
			  if(this.current===null&&this.Field[y][x].Figure!==null){
				  if(this.Field[y][x].Figure.side!==this.hod){
					  return;
				  }
				  this.current=this.Field[y][x].Figure;
			  }
			  else{
				if(!this.current.mayMoveIfSvyazka(x,y)){
					return;
				}
				console.log(this.figureMate)
				if(this.figureMate!==null){
					if(!this.figureMate.mayMoveIfShah(this.current, x,y)){
						return;
					}
				}
				else if((this.figureMate!==null)&&this.current.type!=="King"){
				 	return;
				}
				if(this.Field[y][x].Figure===null){
					this.current.move(x,y,this.Field[y][x].Looks);
					this.current=null;
					return;
				}
				this.current.eatFigure(x,y,this.Field[y][x])
				  this.current=null;
			  }
			};
		  }
	}

	FigureLooks(){
		for(let i=0; i<this.figures.length;i++){
			this.figures[i].clearSvyzka();
		}
		for(let i=0; i<8;i++){
			for(let j=0; j<8;j++)
			{
				this.Field[i][j].Looks=[];
				this.Field[i][j].Attaks=[];
			}
		}
		for(let i=0; i<8;i++){
			for(let j=0; j<8;j++)
			{
				let figure=this.Field[i][j].Figure;
				if(figure===null){
					continue;
				}
				let moves=figure.mayWalk;
				let x=figure.coord.x;
				let y=figure.coord.y;
				for(let l=0; l<moves.length;l++)
				{
					if(figure.type==="Pawn" || figure.type==="King" || figure.type==="Horse"){
						x+=moves[l].x;
						y+=moves[l].y;
						if(this.coordsIndexError(x,y)){
							x=figure.coord.x;
							y=figure.coord.y;
							continue;
						}
						if(figure.type==="Pawn"){
							let coords=figure.mayEatFigure();
							if(coords!==null){
								coords.forEach(el => {
									if(this.Field[el.y][el.x]?.Figure?.side===figure.side){
										this.Field[el.y][el.x].Looks.push(figure);
										return;	
									}
									this.Field[el.y][el.x].Attaks.push(figure);
									this.Field[el.y][el.x].Attaks=Array.from(new Set(this.Field[el.y][el.x].Attaks));
									// this.Field[el.y][el.x].eat=true;
								});
							}
						}
						if(figure.type==="Pawn"&&this.Field[y][x].Figure!==null){
							continue;
						}
						this.Field[y][x].Looks.push(figure);
						if(figure.type!=="Pawn"){
							let side=this.Field[y][x]?.Figure?.side;
							if(this.Field[y][x].Figure===null&&side===null){
								this.Field[y][x].Attaks.push(figure)
							}
							else if(side!==figure.side){
								this.Field[y][x].Attaks.push(figure) 
							}
						}
						x=figure.coord.x;
						y=figure.coord.y;
					}

					if(figure.type==="Pawn" || figure.type==="King" || figure.type==="Horse"){
						continue;
					}
					x+=moves[l].x;
					y+=moves[l].y;
					while(!this.coordsIndexError(x,y)&&this.Field[y][x]?.Figure===null)
					{
						this.Field[y][x].Looks.push(figure)
						this.Field[y][x].Attaks.push(figure)
						x+=moves[l].x;
						y+=moves[l].y;
					}
					if(!this.coordsIndexError(x,y)&&this.Field[y][x]?.Figure?.side===figure.side){
						this.Field[y][x].Looks.push(figure);
					}
					if(!this.coordsIndexError(x,y)&&this.Field[y][x]?.Figure?.side!==figure.side){
						this.Field[y][x].Attaks.push(figure)
					}
					x=figure.coord.x;
					y=figure.coord.y;
				}

			}
		}
		for(let i=0; i<this.figures.length;i++){
			this.figures[i].svyazkaFigur();
		}
		this.checkShah();
	}

	coordsIndexError(x,y){
		return (x<=-1 ||  x>=8) || (y<=-1 || y>=8)
	}

	setHod(side){
		if(side==="black"){
			this.hod="white";
		}
		else{
			this.hod="black"
		}
	}

	checkShah(){
		this.whiteKing.checkShah();
		this.blackKing.checkShah();
	}
}