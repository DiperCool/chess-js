import {GameField} from "./GameField.js";

let gm= new GameField();




class A{

    invoke(){
        console.log("class a");
    }
}


class B extends A{
    invoke(){
        console.log("class b");
    }
}

let lol= new B();


lol.invoke();
