import {Figure} from "../Figure.mjs";

export class Horse extends Figure{
    constructor(id,coord,side,field){
        super(id,
            "Horse", 
            coord,
            `js/imgs/${side==="black"?"bN.png":"wN.png"}`, 
            side, 
            field,
            [{y:-2,x:1},{y:-1,x:2},{y:-2,x:-1},{y:-1,x:-2},{y:2,x:1},{y:1,x:2},{y:2,x:-1},{y:1,x:-2}]);
    }
    move(x,y,looks){
        if(looks.filter(x=>x.id===this.id).length!==0){
            this.field.Field[this.coord.y][this.coord.x].Figure=null;
            this.field.Field[y][x].Figure=this;
            this.coord.y=y;
            this.coord.x=x;
            this.field.setHod(this.side);
            this.field?.figureMate?.clear();
            this.field.FigureLooks();
            this.field.drawField();

        }
        this.firstHod=true;
    }
}