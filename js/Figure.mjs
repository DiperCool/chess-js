export class Figure{

    constructor(id,type, coord, img,side, field, mayWalk){
        this.id=id;
        this.type=type;
        this.side=side;
        this.coord=coord;
        this.img=img;
        this.field=field;
        this.mayWalk=mayWalk;
        this.svyzka=false;
        this.whereMayMoveIfSvyzka=[]
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
        return true;

    }
    svyazkaFigur(){
        if(this.type==="King" || this.type==="Pawn" || this.type==="Horse"){
            return;
        }

        let x=this.coord.x;
        let y=this.coord.y;
        for(let i=0; i<this.mayWalk.length; i++){
            x+=this.mayWalk[i].x;
            y+=this.mayWalk[i].y;
            let lol=0;
            if(this.field.coordsIndexError(x,y)){
                x=this.coord.x;
                y=this.coord.y;
                continue;
            }
            let current=null;
            let king=false;
            while(true){
                if(this.field.coordsIndexError(x,y)){
                    x=this.coord.x;
                    y=this.coord.y;
                    break;
                }
                let field=this.field.Field[y][x];
                if(!(field?.Figure===null)){
                    lol+=1;
                }
                if(field?.Figure?.type==="King"&&field?.Figure?.side!==this.side&&current!==null&&lol<=2){
                    king=true;
                    current.setSvyazka(this, {x:this.mayWalk[i].x,y:this.mayWalk[i].y});
                    console.log("SVYAZ");
                    return;
                }
                if(field?.Figure?.side!==this.side&&field?.Figure!==null&&current===null){
                    current=field.Figure;
                    x+=this.mayWalk[i].x;
                    y+=this.mayWalk[i].y;
                    continue;
                }
                if(field?.Figure!==null&&current!==null){
                    break;
                }
                x+=this.mayWalk[i].x;
                y+=this.mayWalk[i].y;
            }
            x=this.coord.x;
            y=this.coord.y;
        }
        return null;

    }

    setSvyazka(figure, coord){
        this.svyzka=true;
        let x=figure.coord.x;
        let y= figure.coord.y;
        let current=null;
        while(current===null||current?.id===this.id){
            this.whereMayMoveIfSvyzka.push({x:x,y:y});
            x+=coord.x;
            y+=coord.y;
            current= this.field.Field[y][x].Figure;
        }

    }

    clearSvyzka(){
        this.svyzka=false;
        this.whereMayMoveIfSvyzka=[];
    }

    mayMoveIfSvyazka(x,y){
        if(!this.svyzka){
            console.log(1);
            return true;
        }
        if(this.whereMayMoveIfSvyzka.filter(el=>el.x===x&&el.y===y).length===0){
            return false;
        }
        return true;
    }

}