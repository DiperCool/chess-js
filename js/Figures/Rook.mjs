import {Figure} from "../Figure.mjs";

export class Rook extends Figure{
    constructor(id,coord,side,field){
        super(id,
            "Rook", 
            coord,
            `js/imgs/${side==="black"?"bR.png":"wR.png"}`, 
            side, 
            field,
            [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]);

        this.firstHod=false;
    }
    move(x,y,looks){
        if(looks.filter(x=>x.id===this.id).length!==0){
            this.field.Field[this.coord.y][this.coord.x].Figure=null;
            this.field.Field[y][x].Figure=this;
            this.coord.y=y;
            this.coord.x=x;
            this.field?.figureMate?.clear();
            this.field.setHod(this.side);
            this.field.FigureLooks();
            this.field.drawField();
        }
        this.firstHod=true;
    }
}