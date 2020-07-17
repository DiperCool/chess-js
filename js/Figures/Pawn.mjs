import {Figure} from "../Figure.mjs";
import {Rook} from "./Rook.mjs";
import {Elephan} from "./Elephan.mjs";
import {Quen} from "./Quen.mjs";
import {Horse} from "./Horse.mjs"
export class Pawn extends Figure{

    constructor(id,coord,side,field){
        super(id,
            "Pawn", 
            coord,
            `js/imgs/${side==="black"?"bP.png":"wP.png"}`, 
            side, 
            field,
            [{x:0,y:side==="black"?1:-1},{x:0,y:side==="black"?2:-2}]);

        this.firstHod=false;
        this.eat;
        if(side==="white"){
            this.eat=[{x:1, y:-1},{x:-1,y:-1}]
        }
        else{
            this.eat=[{x:1, y:1},{x:-1,y:1}]
        }



    }

    move(x,y,looks){
        if(looks.filter(x=>x.id===this.id).length!==0){
            this.field.Field[this.coord.y][this.coord.x].Figure=null;
            this.field.Field[y][x].Figure=this;
            this.field?.figureMate?.clear();
            this.coord.y=y;
            this.coord.x=x;
            this.firstHod=true;
            this.mayWalk.length=1;
            this.field.setHod(this.side);
            this.field.FigureLooks();
            this.field.drawField();
            if(y===0||y===7){
                console.log("new figire");
                this.change(prompt("Введите название новой фигуры: Horse, Pawn, Rook, Quen"));
            }
        }
    }
    mayEatFigure(){
        let arr=[];
        for(let i=0; i<this.eat.length; i++){
            let iX=this.coord.x+this.eat[i].x;
            let iY=this.coord.y+this.eat[i].y;
            if(this.field.coordsIndexError(iY,iX)){
                continue;
            }
            arr.push({x:iX,y:iY})
        }
        return arr.length===-1?null:arr;
    }
    eatFigure(x,y){
        if(this.field.coordsIndexError(x,y)){
            return false;
        }
        if(this.field.Field[y][x].Attaks.filter(x=>x.id===this.id).length===0){
            return false;
        }
        this.field.figures=this.field.figures.filter(el=>el.coord.x!==x||el.coord.y!==y);
        this.field.Field[y][x].Figure=null;

        // console.log(arr.filter(el=>el.id!==this.field.Field[y][x]?.Figure?.id))
        this.field?.figureMate?.clear();
        this.field.Field[this.coord.y][this.coord.x].Figure=null;
        this.field.Field[y][x].Figure=this;
        this.coord.y=y;
        this.coord.x=x;
        this.firstHod=true;
        this.field.setHod(this.side);
        this.field.FigureLooks();
        this.field.drawField();
        if(y===0||y===7){
            this.change(prompt("Введите название новой фигуры: Horse, Pawn, Rook, Quen"));
        }
        return true;

    }
    attack(){
        return this.mayEatFigure().filter(x=>this.field.Field[x.y][x.x].Figure!==null&&this.field.Field[x.y][x.x]?.Figure?.side!==this.side);
    }
    change(type){
        let newFigure;
        if(type==="Quen"){
            newFigure= new Quen(this.id,this.coord, this.side,this.figure);
        }
        else if(type==="Rook"){
            newFigure= new Rook(this.id,this.coord, this.side,this.figure);
        }
        else if(type==="Elephan"){
            newFigure= new Elephan(this.id,this.coord, this.side,this.figure);
        }
        else if(type==="Horse"){
            newFigure= new Horse(this.id,this.coord, this.side,this.figure);
        }
        else{
            return;
        }

        console.log("ZHOPE")
        this.type=newFigure.side;
        this.img=newFigure.img;
        this.mayWalk=newFigure.mayWalk;
        this.field.Field[this.coord.y][this.coord.x].Figure=this;
        this.field.FigureLooks();
        this.field.drawField();
    }
}