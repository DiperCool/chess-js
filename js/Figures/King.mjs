import {Figure} from "../Figure.mjs";

export class King extends Figure{
    constructor(id,coord,side,field){
        super(id,
            "King", 
            coord,
            `js/imgs/${side==="black"?"bK.png":"wK.png"}`, 
            side, 
            field,
            [{x:1, y:-1},{x:-1,y:-1},{x:1, y:1},{x:-1,y:1},{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]);
            this.isMat=false;
            this.isShah=false;
            this.shahMoves=[];
            this.Attaks=[];
            this.FieldMustNakrit=[];
    }
    move(x,y,looks){
        if(this.isShah&&this.shahMoves.filter(el=>el.x===x&&el.y===y).length!==0){
            return;
        }
        console.log(this.rookirovka(x,y))
        if(this.mayMove(x,y,false)){
            // if(this.field.Field[y][x].eat&&this.field.Field[y][x].Looks.filter(x=>x.side!==this.side).length!==0){
            //     return;
            // }
            this.clear()
            this.field?.figureMate?.clear();
            this.field.Field[this.coord.y][this.coord.x].Figure=null;
            this.field.Field[y][x].Figure=this;
            this.coord.y=y;
            this.coord.x=x;
            this.field.setHod(this.side)
            this.field.FigureLooks();
            this.field.drawField();
        }
        this.firstHod=true;
    }

    eatFigure(x,y){        
        if(!this.mayEat(x,y)){
            return false;
        }
        let arr;
        if(this.side==="white"){
            arr=this.field.white;
        }
        else{
            arr=this.field.black
        }
        this.clear()
        this.field?.figureMate?.clear();
        this.field.Field[y][x].Figure=null;
        this.field.figures=this.field.figures.filter(el=>el.coord.x!==x||el.coord.y!==y);
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

    setShah(figure,coord,isOne){
        let iX=figure.coord.x;
        let iY= figure.coord.y;
        let lol=false;
        this.FieldMustNakrit.push({x:iX, y:iY});
        iX+=coord.x;
        iY+=coord.y;
        this.isShah=true;
        this.Attaks.push(figure);
        this.field.figureMate=this;
        if(isOne){
            return;
        }
        while((!this.field.coordsIndexError(iX,iY)&&(!lol||this.field.Field[iY][iX].Figure===null))){
            if(this.field.Field[iY][iX]?.Figure?.type==="King"){
                lol=true;
            }
            if(!lol){
                this.FieldMustNakrit.push({x:iX, y:iY});
            }
            this.shahMoves.push({x:iX, y:iY});
            iX+=coord.x;
            iY+=coord.y;
        }
        console.log(this.FieldMustNakrit)
    }
    clear(){
        this.shahMoves=[];
        this.Attaks=[];
        this.FieldMustNakrit=[];
        this.isShah=false;
        this.field.figureMate=null;
    }

    checkShah(){
        let arr=[]
        let field=this.field.Field[this.coord.y][this.coord.x];
        let attaks=field.Attaks.filter(x=>x.side!==this.side)
        if(attaks.length===0){
            return;
        }
        for(let i=0; i<attaks.length;i++){
            let res=this.getCoordWithShah(attaks[i]);
            arr.push(res);
        }
        for(let i=0;i<attaks.length;i++){
            this.setShah(attaks[i], arr[i],attaks[i].type==="Horse"||attaks[i].type==="Pawn"?true:false);
        }
        if(this.checkMate()){
            return;
        }
        console.log(this.shahMoves,
            this.Attaks,
            this.FieldMustNakrit)

        
    }

    checkMate(){
        for(let i=0;i<this.mayWalk.length; i++){
            if(this.mayMoveIfShah2(this.coord.x+this.mayWalk[i].x,this.coord.y+this.mayWalk[i].y)){
                return false;
            }
            else if(this.mayEatIfShah(this.coord.x+this.mayWalk[i].x,this.coord.y+this.mayWalk[i].y)){
                return false;
            }
        }
        if(this.Attaks.length>1){
            alert("MATE");
            return true;
        }
        if(!this.checkFiguresWhereNakritShah()){
            alert("MATE");
            return true;
        }
    }

    mayEat(x,y){
        if(this.field.coordsIndexError(x,y)){
            return false;
        }
        // if(!this.kingMayMoveIfShah(x,y)){
        //     return false;
        // }
        if(this.field.Field[y][x]?.Figure?.side===this.side){
            return false;
        }
        if((this.field.Field[y][x].Attaks.filter(x=>x.id===this.id).length===0)
        ||this.field.Field[y][x].Attaks.filter(x=>x.side!==this.side).length!==0){
            return false;
        }

        if(this.field.Field[y][x]?.Figure?.side!==this.side
            &&this.field.Field[y][x].Looks.filter(x=>x.side!==this.side).length!==0){
                    return false;
            }
        return true;
    }

    mayMove(x,y,rookirovka=false){
        if(this.field.coordsIndexError(x,y)){
            return false;
        }
        if(rookirovka){
            return true;
        }
        if(this.field.Field[y][x]?.Figure?.side===this.side){
            return false;
        }
        if(this.field.Field[y][x].Attaks.filter(x=>x.side!==this.side).length!==0){
            return false
        }
        if(this.field.Field[y][x].Looks.filter(x=>x.id===this.id).length===0){
            return false;
        }
        return true;
    }

    getCoordWithShah(figure){
        let x=figure.coord.x;
        let y=figure.coord.y;
        if(figure.type==="Pawn"){
            return figure.attack().filter(el=>this.field.Field[el.y][el.x].Figure.type==="King");
        }
        for(let i=0; i<figure.mayWalk.length; i++){
            x+=figure.mayWalk[i].x;
            y+=figure.mayWalk[i].y;
            if(this.field.coordsIndexError(x,y)){
                x=figure.coord.x;
                y=figure.coord.y;
                continue;
            }
            let field= this.field.Field[y][x];
            let current= field.Figure;
            while(current===null&&(figure.type!=="Pawn"||figure.type!=="Horse")){
                if(this.field.coordsIndexError(x,y)){
                    x=figure.coord.x;
                    y=figure.coord.y;
                    break;
                }
                current=this.field.Field[y][x].Figure;
                x+=figure.mayWalk[i].x;
                y+=figure.mayWalk[i].y;
            }
            x=figure.coord.x;
            y=figure.coord.y;
            if(current?.type==="King"&&current?.side===this.side){
                return {x:figure.mayWalk[i].x,y:figure.mayWalk[i].y}
            }
        }
        return null;
    }

    mayMoveIfShah(figure,x,y){
        console.log(1212122122);
        if(figure.type==="King"&&this.shahMoves.filter(el=>el.x===x&&el.y===y).length!==0){
            return false;
        }
        else if(figure.type!=="King"&&this.FieldMustNakrit.filter(el=>el.x===x&&el.y===y).length===0){
            return false;
        }
        else if(figure.type!=="King"&&this.Attaks.length>1){
            return false;
        }
        return true;
    }

    checkFiguresWhereNakritShah(){
        let pawns= this.field.figures.filter(x=>x.type==="Pawn"&&x.side===this.side&&x.svyzka!==true);
        for(let i=0; i<pawns.length;i++){
            let coord= pawns[i].attack();
            if(this.FieldMustNakrit.filter(el=>el.x===coord.x&&el.y===coord.y).length!==0){
                return true;
            }
        }
        let result= this.FieldMustNakrit.filter(x=>{
            let field=this.field.Field[x.y][x.x];
            if(field.Looks.filter(el=>el.side===this.side&&el.type!=="King"&&!el.svyzka).length===0){;
                return false;
            }
            return true;
        })
        return result.length===0?false:true;
    }

    mayEatIfShah(x,y){
        if(this.shahMoves.filter(el=>el.x===x&&el.y===y).length!==0){
            return false;
        }
        if(!this.mayEat(x,y)){
            return false;
        }
        return true;
    }
    mayMoveIfShah2(x,y){
        if(this.shahMoves.filter(el=>el.x===x&&el.y===y).length!==0){
            return false;
        }
        
        if(!this.mayEatIfShah(x,y)){
            return false;
        }
        if(!this.mayMove(x,y)){
            return false;
        }
        return true;
    }


    rokirovkaShort(x,y){
        let ySide=this.side==="black"?0:7
        if(x===6&&y===ySide){
            let rook=this.field.Field[ySide][7].Figure;
            if((rook?.type!=="Rook"&&rook?.side!==this.side)||this.firstHod||rook.firstHod||rook===null){
                return false;
            }
            let field=this.field.Field[ySide][6];
            if(field.Figure!==null){
                return false;
            }
            let field2=this.field.Field[ySide][5];
            if(field2.Figure!==null){
                return false;
            }
            if(this.fieldAttack(6,ySide)||this.fieldAttack(5,ySide)){
                return false;
            }

            this.field.Field[ySide][5].Figure=rook;
            this.field.Field[ySide][7].Figure=null;
            this.field.Field[ySide][4].Figure=null;
            this.field.Field[ySide][6].Figure=this;


            this.firstHod=true;
            this.field.setHod(this.side);
            this.field.FigureLooks();
            this.field.drawField();



            return true;

        }
    }

    rokirovkaLong(x,y){
        let ySide=this.side==="black"?0:7
        if(x===2&&y===ySide){
            let rook=this.field.Field[ySide][0].Figure;
            if((rook?.type!=="Rook"&&rook?.side!==this.side)){//||this.firstHod||rook.firstHod||rook===null||this.isShah
                return false;
            }
            let field=this.field.Field[ySide][3];
            if(field.Figure!==null){
                return false;
            }
            let field2=this.field.Field[ySide][2];
            if(field2.Figure!==null){
                return false;
            }
            let field3=this.field.Field[ySide][1];
            if(field3.Figure!==null){
                return false;
            }
            if(this.fieldAttack(3,ySide)||this.fieldAttack(2,ySide)||this.fieldAttack(1,ySide)){
                return false;
            }

            this.field.Field[ySide][3].Figure=rook;
            this.field.Field[ySide][0].Figure=null;
            this.field.Field[ySide][4].Figure=null;
            this.field.Field[ySide][2].Figure=this;


            this.firstHod=true;
            this.field.setHod(this.side);
            this.field.FigureLooks();
            this.field.drawField();



            return true;
        }
    }

    rookirovka(x,y){
        if(this.isShah){
            return;
        }
        this.rokirovkaLong(x,y);
        this.rokirovkaShort(x,y);
    }
    fieldAttack(x,y){
        return this.field.Field[y][x].Attaks.filter(x=>x.side!==this.side).length!==0;
    }
}