
player1deck=[],player2deck=[]
player1defense=[],player2defense=[]
const fixedpenaltyvalue=3
player1points=0
player2points=0
//0 means player turn,1 means computer turn
turn=null;
firstmove=true
function renderDefense(){
    player=turn==0?"pl1":"pl2"
    defense=turn==0?player1defense:player2defense
        for(let i=0;i<3;i++){
                if($(".defensecard"+(i+1)+player).is(':empty')){
                    var imgtemp =document.createElement("img");
                    imgtemp.width=200;
                    imgtemp.height=250;
                    imgtemp.src=("img/tiercards/tempcard"+defense[i]+".png");
                    $(".defensecard"+(i+1)+player).append(imgtemp).animateCss("animate__flipInY")
                }
    }
    if(firstmove){
        player=turn==0?"pl2":"pl1"
        defense=turn==0?player2defense:player1defense
        for(let i=0;i<3;i++){
            if($(".defensecard"+(i+1)+player).is(':empty')){
                var imgtemp =document.createElement("img");
                imgtemp.width=200;
                imgtemp.height=250;
                imgtemp.src=("img/tiercards/tempcard"+defense[i]+".png");
                $(".defensecard"+(i+1)+player).append(imgtemp).animateCss("animate__flipInY")
            }
        }
    }
    if(firstmove)
        firstmove=false;

}
function findplacetoinsert(){
    ind=-1
    player=turn==0?"pl1":"pl2"
    for (let index = 0; index < 3 && ind==-1; index++) {
        if($(".defensecard"+(index+1)+player).is(':empty')){
            ind=index;
        }
    }
    return ind
}
function restoreDefense(){
    deck=turn==0?player1deck:player2deck
    defense=turn==0?player1defense:player2defense
        while(defense.length!=3 && deck.length!=0 ){
            index=findplacetoinsert()
           // playerdefense.push(playerdeck[0]);
            defense.splice(index,0,deck[0])
            deck.shift()
        }
        if(firstmove){
            deck=turn==0?player2deck:player1deck
            defense=turn==0?player2defense:player1defense
            while(defense.length!=3 && deck.length!=0 ){
                index=findplacetoinsert()
               // playerdefense.push(playerdeck[0]);
                defense.splice(index,0,deck[0])
                deck.shift()
            }
        }
    renderDefense()
}
function compare(defensecard){
    let currAttackCard=getCurrentAttackCard()
    flag=false
    if(currAttackCard>defensecard || (currAttackCard==0 && defensecard==4)){
        flag=true
        if(currAttackCard==4){
            if(defensecard==0){
                flag=false;
            }
        }
    }
    return flag
}
function beatcard(){
    player=turn==0?"pl1":"pl2"
    deck=turn==0?player1deck:player2deck
    defense=turn==0?player2defense:player1defense
    if(!($(".attackingcard"+player).is(':empty'))){
    classname=$(this).attr("class")
    defensecardsrc=$("."+classname+" img").attr("src")
    console.log(defensecardsrc)
    defensecard=defensecardsrc.match(/[0-9]+/)[0]
    flag=compare(parseInt(defensecard))
    if(flag){
        $("."+classname+ " img").css('position', 'relative').animate({ left: '-800px',top:'-1000px' }, function() { $(this).remove(); })
        $("."+classname+" img").remove()
        defensecardnumber=parseInt(classname.match(/\d/g)[0])
        deck.push(defense[defensecardnumber-1])
        defense[defensecardnumber-1]=-1
        updateDeckCount()
        endOfTurnFlag=checkEndOfTurn()
        if(endOfTurnFlag){
            deleteBeatenDefense()
            checkForDefense()
            disableclickable()
            enableEndButton()
    }
    }  
    } 
}
function checkForEmptyDefense(){
    if(turn==0){
        if(player2defense.length==0){
            player2points++
        }
    }
    else if(turn==1){
        if(player1defense.length==0){
            player1points++
        }
    }
}
function deleteBeatenDefense(){
    defense=turn==0?player2defense:player1defense
        for(let i=defense.length;i--;){
            if(defense[i]===-1)
                defense.splice(i,1)
        }
}
function checkForDefense(){
    currAttackCard=getCurrentAttackCard()
    player=turn==0?"pl1":"pl2"
    defense=turn==0?player2defense:player1defense
    deckenemy=turn==0?player2deck:player1deck
    deckcurrent=turn==0?player1deck:player2deck
    console.log("Зашел сюда")
        if(defense.length!=0){
            console.log("Зашел  и сюда")
            deckenemy.push(currAttackCard)
            temp=".attackingcard"+player+" img"
            if(player=="pl1"){
            setTimeout(() => {
                $(temp).css('position', 'relative').animate({ left: '-1000px',bottom:'-1000px' }, function() { $(this).remove(); });
            }, 400);
        }
            else{
                setTimeout(() => {
                    $(temp).css('position', 'relative').animate({ left: '-1000px',bottom:'1000px' }, function() { $(this).remove(); });
                }, 400);
            }
        }
        else{
            if(turn==0)
                player2points++
            else
                player1points++
            deckcurrent.push(currAttackCard)
            temp=".attackingcard"+player+" img"
            setTimeout(() => {
                $(temp).css('position', 'relative').animate({ left: '-1000px'}, function() { $(this).remove(); });
            }, 400);
        }
        updateDeckCount()






}
function passturn(){
    turn=turn%2==0?1:0
    $(".endturn").off("click")
    newturn()
}
function enableEndButton(){
    $(".endturn").on("click",passturn)
    console.log("button enable")
}
function checkForSameTier(attackcard){
    flagForSameTier=true
    const arr=turn==0?player1defense:player2defense
    if(arr.length==0)
        flagForSameTier=false;
    for (let index = 0; index<arr.length; index++) {
        if(attackcard!=arr[index])
            flagForSameTier=false
    }
    return flagForSameTier
}
//Автоматизировать
function checkConditionsForTake(attackcard){
    flag=true
    deck=turn==0?player1deck:player2deck
    if(deck.length==0 || !checkForSameTier(attackcard))
        flag=false
    return flag
}
//попробовать сократить
function checkEndOfGame(){
    flag=false
    if(turn==0){
        if(((3-player1defense.length)+1>player1deck.length) || player1points==3)
            flag=true
    }
    else if(turn==1){
        if(((3-player2defense.length)+1>player2deck.length) || player2points==3)
            flag=true
    }
    return flag
}
function getCurrentAttackCard(){
    src=$(".attackingcardpl1").is(':empty')?($(".attackingcardpl2 img").attr('src')):($(".attackingcardpl1 img").attr('src'))
    currAttackCard=src.match(/[0-9]+/)[0]
    return parseInt(currAttackCard)
}
function checkEndOfTurn(){
    temp=turn==0?"pl2":"pl1"
    endOfTurnFlag=true
    for (let index = 0; index < 3; index++) {
        if(!($(".defensecard"+(index+1)+temp).is(":empty"))){
        defensecardsrc=$(".defensecard"+(index+1)+temp+" img").attr("src")
        defensecard=defensecardsrc.match(/[0-9]+/)[0]
        if(compare(parseInt(defensecard))){
            endOfTurnFlag=false
        }
    }
    }
    return endOfTurnFlag
}
function updateDeckCount(){
    $(".player1count").html("Player 1 count "+player1deck.length)
    $(".player2count").html("Player 2 count "+player2deck.length)
}
function takecard(){
    player=turn==0?"pl1":"pl2"
    deck=turn==0?player1deck:player2deck
        let attackcard=deck[0]
        if(!($(".attackingcard"+player).is(':empty')) ){
           currentCard=getCurrentAttackCard()
           flag=checkConditionsForTake(currentCard)
           if(flag){
           $(".attackingcard"+player+" img").attr("src","img/tiercards/tempcard"+attackcard+".png").animateCss("animate__flipInY")
           deck.shift()
           deck.push(currentCard)
           }
        }
        else if($(".attackingcard"+player).is(':empty')){
            var imgtemp =document.createElement("img");
            imgtemp.width=200;
            imgtemp.height=250;
            imgtemp.src=("img/tiercards/tempcard"+deck[0]+".png");
            deck.shift()
            updateDeckCount()
            $(".attackingcard"+player).append(imgtemp).animateCss("animate__flipInY");
        }
        endOfTurnFlag=checkEndOfTurn()
        if(endOfTurnFlag){
            console.log("end true")
            checkForDefense()  
            disableclickable()
            enableEndButton()       
    }
}

//Make img clickable depending on turn
function initclickable(){
    temp=turn==0?"2":"1"
        $(".player"+(turn+1)+"deck").on("click",takecard)
        //$(".playersdeck").off("click")
        for (let index = 1; index < 4; index++) {
            $(".defensecard"+index+"pl"+temp).on("click",beatcard)
        }
    
}
//Disable clickable img because turn is over
function disableclickable(){
    number=turn==0?"1":"2"
    player=turn==0?"pl2":"pl1"
        $(".player"+number+"deck").off("click")
        for (let index = 1; index < 4; index++) {
            $(".defensecard"+index+player).off("click")
        }

}
//this func starts the turn of one of the players
function newturn(){
    //check if player already lost on start of his turn 
    endOfGame=checkEndOfGame()
    if(endOfGame ){
        $(".result").html("Player"+(turn+1)+" lost")
    }
    else{
    if(turn==1){
        $(".result").html("Player 2 turn");
    }
    else 
        $(".result").html("Player 1 turn");
    initclickable()
    restoreDefense()
    updateDeckCount()
}
}
function tosscoin(){
    turn=Math.floor(Math.random()*2);
    $(".cointoss").hide();
    window.turn=turn;
    newturn();
}
function fillcardsarray(){
    for (let index = 0; index <5; index++) {
        //player1deck.push(index);
        for (let index2 = 0; index2 < 4; index2++) {
            player1deck.push(index);
            player2deck.push(index);
        }              
    }
}
function randomshuffle(){
    let currentindex=player1deck.length;
    let randomindex;
    while(currentindex!=0){
        randomindex=Math.floor(Math.random()*currentindex);
        currentindex--;
        [player1deck[currentindex],player1deck[randomindex]]=[player1deck[randomindex],player1deck[currentindex]];
        randomindex=Math.floor(Math.random()*currentindex);
        [player2deck[currentindex],player2deck[randomindex]]=[player2deck[randomindex],player2deck[currentindex]]
    }
}

function start(){
    hideelems();
    $("#ingame-header").show().addClass("animate__animated animate__fadeInDown")
    $("#board").show();
    fillcardsarray();
    randomshuffle();
}
function hideelems(){
    $("#thumbnail").hide();
    $("#description").hide();
}

$.fn.extend({
	animateCss: function(animationName, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animate__animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animate__animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
	}
});