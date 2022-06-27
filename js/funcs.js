player1deck=[],player2deck=[]
player1defense=[],player2defense=[]
const fixedpenaltyvalue=3
player1points=0
player2points=0
//0 means player1 turn,1 means player2 turn
turn=null;
firstmove=true
//this func render defense images of current player
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

//find index of defense card that beaten
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

//restore defense cards to 3 cards using findplacetoinsert func
function restoreDefense(){
    deck=turn==0?player1deck:player2deck
    defense=turn==0?player1defense:player2defense
        while(defense.length!=3 && deck.length!=0 ){
            index=findplacetoinsert()
            defense.splice(index,0,deck[0])
            deck.shift()
        }
        if(firstmove){
            deck=turn==0?player2deck:player1deck
            defense=turn==0?player2defense:player1defense
            while(defense.length!=3 && deck.length!=0 ){
                index=findplacetoinsert()
                defense.splice(index,0,deck[0])
                deck.shift()
            }
        }
    renderDefense()
}

//compare if current attacking card of player can beat enemy defense card which was choosen
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


//this func checking if current attacking card can beat choosen defense card and removing it if possible
//At the end of the func there is  a check for case when we can't beat any card anymore so it is the  end of turn  
//And if it is the end of turn we doing preparing things for next turn
function beatcard(){
    player=turn==0?"pl1":"pl2"
    deck=turn==0?player1deck:player2deck
    defense=turn==0?player2defense:player1defense
    if(!($(".attackingcard"+player).is(':empty'))){
    classname=$(this).attr("class")
    defensecardsrc=$("."+classname+" img").attr("src")
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

//check for empty defense to increase penalty points of player
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

//every beaten card was marked as -1 in defense array,so at this func we deleting these elements
function deleteBeatenDefense(){
    defense=turn==0?player2defense:player1defense
        for(let i=defense.length;i--;){
            if(defense[i]===-1)
                defense.splice(i,1)
        }
}


//this func decides to which deck  move current attacking card depending on some conditiond(if there empty defense or no)
function checkForDefense(){
    currAttackCard=getCurrentAttackCard()
    player=turn==0?"pl1":"pl2"
    defense=turn==0?player2defense:player1defense
    deckenemy=turn==0?player2deck:player1deck
    deckcurrent=turn==0?player1deck:player2deck
        if(defense.length!=0){
            deckenemy.push(currAttackCard)
            temp=".attackingcard"+player+" img"
            if(player=="pl1"){
            setTimeout(() => {
                $(temp).css('position', 'relative').animate({ left: '-1000px',bottom:'-1000px' }, function() { $(this).remove(); });
            }, 500);
        }
            else{
                setTimeout(() => {
                    $(temp).css('position', 'relative').animate({ left: '-1000px',bottom:'1000px' }, function() { $(this).remove(); });
                }, 500);
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
            }, 500);
        }
        updateDeckCount()
}

//change state of 'turn' and call func to pass turn for another player
function passturn(){
    turn=turn%2==0?1:0
    $(".endturn").off("click")
    newturn()
}

//enable click for "End Turn" button
function enableEndButton(){
    $(".endturn").on("click",passturn)
}

//check if current atack card and all cards in defense array are same tier
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
//check conditions if current player can change attacking card
function checkConditionsForTake(attackcard){
    flag=true
    deck=turn==0?player1deck:player2deck
    if(deck.length==0 || !checkForSameTier(attackcard))
        flag=false
    return flag
}
//Check conditions of game end(if we cant restore defense array to 3 card or when someone reaches max penalty points value)
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

//get tier of current attacking card
function getCurrentAttackCard(){
    src=$(".attackingcardpl1").is(':empty')?($(".attackingcardpl2 img").attr('src')):($(".attackingcardpl1 img").attr('src'))
    currAttackCard=src.match(/[0-9]+/)[0]
    return parseInt(currAttackCard)
}

//check conditions for end of turn(if current player attacking card can't beat another enemy defense array card )
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


//this func takes attacking card from deck or changing her if we already have it
//At the end of func there is check for end of turn in case if this attacking card can't beat anyone from enemy defense array  
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
        $(".result").html("Player "+(turn+1)+" lost")
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
//thif func randomly get first value of turn
function tosscoin(){
    turn=Math.floor(Math.random()*2);
    $(".cointoss").hide();
    window.turn=turn;
    newturn();
}

// this func fills players decks 
function fillcardsarray(){
    for (let index = 0; index <5; index++) {
        //player1deck.push(index);
        for (let index2 = 0; index2 < 4; index2++) {
            player1deck.push(index);
            player2deck.push(index);
        }              
    }
}

//this func perform random shuffle of each deck
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
//this func used to add and then remove animation classes from animate.css
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