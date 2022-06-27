
compdeck=[],playerdeck=[]
playerdefense=[],compdefense=[]
const fixedpenaltyvalue=3
//0 means player turn,1 means computer turn
turn=null;
firstmove=true
function renderDefense(){
    if(turn==0 || firstmove){
        for(let i=0;i<3;i++){
            console.log("я был тут")
            $(":animated").promise().done(function(){
                if($(".defensecard"+(i+1)+"pl").is(':empty')){
                    console.log("и тут был")
                    var imgtemp =document.createElement("img");
                    imgtemp.width=200;
                    imgtemp.height=250;
                    imgtemp.src=("img/tiercards/tempcard"+playerdefense[i]+".png");
                    //imgtemp.src=("img/tiercards/tempcard"+"0.png");
                    $(".defensecard"+(i+1)+"pl").append(imgtemp)
                }
            })

                //$(".defensecard1pl").append(imgtemp).animateCss("animate__flipInY")
            
        //     if($(".defensecard"+(i+1)+"comp").is(':empty')){
        //         var imgtemp =document.createElement("img");
        //         imgtemp.width=200;
        //         imgtemp.height=250;
        //         imgtemp.src=("img/tiercards/tempcard"+compdefense[i]+".png");
        //         //imgtemp.src=("img/tiercards/tempcard"+"0.png");
        //         $(".defensecard"+(i+1)+"comp").append(imgtemp).animateCss("animate__flipInY");
        //         //$(".defensecard1pl").append(imgtemp).animateCss("animate__flipInY")
        // }
    }
}
    if(turn==1 || firstmove){
        for(let i=0;i<3;i++){
            //console.log("тут")
            if($(".defensecard"+(i+1)+"comp").is(':empty')){
                //console.log($(".defensecard"+(i+1)+"comp").is(':empty')+"    defense empty")
                var imgtemp =document.createElement("img");
                imgtemp.width=200;
                imgtemp.height=250;
                imgtemp.src=("img/tiercards/tempcard"+compdefense[i]+".png");
                //imgtemp.src=("img/tiercards/tempcard"+"0.png");
                $(".defensecard"+(i+1)+"comp").append(imgtemp).animateCss("animate__flipInY");
                //$(".defensecard1pl").append(imgtemp).animateCss("animate__flipInY")
        }
        }
    }
    if(firstmove)
        firstmove=false;
}
function findplacetoinsert(){
    ind=-1
    temp=turn==0?"pl":"comp"
    for (let index = 0; index < 3 && ind==-1; index++) {
        if($(".defensecard"+(index+1)+temp).is(':empty')){
            ind=index;
        }
    }
    return ind
}
function restoreDefense(){
    if(turn==0 || firstmove){
        while(playerdefense.length!=3 && playerdeck.length!=0 ){
            console.log(playerdefense.length)
            console.log("вставляем защиту")
            index=findplacetoinsert()
            console.log(index +" index")
           // playerdefense.push(playerdeck[0]);
            playerdefense.splice(index,0,playerdeck[0])
            playerdeck.shift()
        }

    }
     if(turn==1 || firstmove){
        while(compdefense.length!=3 && compdeck.length!=0){
            index=findplacetoinsert()
            //compdefense.push(compdeck[0])
            //compdefense.push(compdeck[0])
            compdefense.splice(index,0,compdeck[0])
            compdeck.shift()
        }
    }
    renderDefense()

}
function checkforemptydecks(){
    let flag=false;
    if(compdeck.length==0 || playerdeck.length==0)
        flag=true;
    return flag;
}
function checkforpenaltypoints(points_player,points_comp){
    let flag=false;
    if(points_comp>=fixedpenaltyvalue && points_player>=fixedpenaltyvalue)
        flag=true
    return flag;
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
function beatcard(defensecardindex){
    if(turn==0){
    if(!($(".attackingcardpl").is(':empty'))){
    classname=$(this).attr("class")
    defensecardsrc=$("."+classname+" img").attr("src")
    defensecard=defensecardsrc.match(/[0-9]+/)[0]
    flag=compare(parseInt(defensecard))
    if(flag){
       // $("."+classname).children("img").remove()
        // setTimeout(() => {
        //     $("."+classname+ " img").css('position', 'relative').animate({ left: '-800px',top:'-1000px' }, function() { $(this).remove(); });
        // }, 500);
        $("."+classname+ " img").css('position', 'relative').animate({ left: '-800px',top:'-1000px' }, function() { $(this).remove(); })
        // $("."+classname+" img").css('position', 'relative').animate({ left: '-2000px',top:'-1000px' }, function() { $("."+classname+" img").remove(); });
        //$("."+classname+" img").css('position', 'relative').animate({ left: '-2000px',top:'-1000px' });
        //$("."+classname+" img").remove()
        $("."+classname+" img").remove()
        defensecardnumber=parseInt(classname.match(/[0-9]+/)[0])
        compdefense.splice(defensecardnumber-1,1)
        playerdeck.push(defensecardnumber)
        updateDeckCount()
        // setTimeout(()=>{
        //     restoreDefense()
        // },500);
        endOfTurnFlag=checkEndOfTurn()
        if(endOfTurnFlag){
            checkForDefense()
            disableclickable()
            enableEndButton()
    }
    }  
    }
    }
    else if(turn==1){
        console.log($(".attackingcardcomp").is(':empty'))
        if(!($(".attackingcardcomp").is(':empty'))){
            console.log("Зашел сюда")
            defensecardsrc=$(".defensecard"+defensecardindex+"pl img").attr("src")
            console.log(defensecardsrc)
            defensecard=defensecardsrc.match(/[0-9]+/)[0]
            flag=compare(parseInt(defensecard))
            if(flag){
                console.log("зашел в удаление")
                console.log("удаляем"+defensecard )
                // setTimeout(()=>{
                //     $(".defensecard"+defensecardindex+"pl img").css('position', 'relative').animate({ left: '-800px',bottom:'-800px' }, function() { $(".defensecard"+defensecardindex+"pl img").remove() })
                // },500)
                $(".defensecard"+defensecardindex+"pl img").css('position', 'relative').animate({ left: '-800px',bottom:'-800px' })
                //$(".defensecard"+defensecardindex+"pl").remove()
                console.log($(".defensecard"+defensecardindex+"pl img").attr("src") +" SRC OF DEF")
                playerdefense.splice(defensecardindex-1,1)
                compdeck.push(defensecard)
                updateDeckCount()
                endOfTurnFlag=checkEndOfTurn()
                if(endOfTurnFlag){
                    checkForDefense()
                }
            }
        }
    }
}
function compChooseBeat(){
    for (let index = 0; index <3; index++) {
        if(!($("defensecard"+(index+1)+"pl").is(':empty'))){
            console.log("Зашел удалять ")
            beatcard(index+1)

        }
    }
}
function checkForDefense(){
    // defense=turn==0?compdefense:playerdefense
    // deck=turn==0?playerdeck:compdeck
    // if(defense.length!=0){
    //     deck.push(getCurrentAttackCard())
    //     updateDeckCount()
    // }
    currAttackCard=getCurrentAttackCard()
    if(turn==0){
        if(compdefense.length!=0){
            compdeck.push(currAttackCard)
            setTimeout(() => {
                $(".attackingcardpl img").css('position', 'relative').animate({ left: '-1000px',bottom:'-1000px' }, function() { $(this).remove(); });
            }, 400);
        }
        else{
            playerdeck.push(currAttackCard)
            setTimeout(() => {
                $(".attackingcardpl img").css('position', 'relative').animate({ left: '-1000px'}, function() { $(this).remove(); });
            }, 400);
        }
        updateDeckCount()
    }
    else if(turn==1){
        console.log("deleting attack")
        if(playerdefense.length!=0){
            playerdeck.push(currAttackCard)
            setTimeout(() => {
                $(".attackingcardcomp img").css('position', 'relative').animate({ left: '-1000px',bottom:'-1000px' }, function() { $(this).remove(); });
            }, 400);
        }
        else{
            compdeck.push(currAttackCard)
            setTimeout(() => {
                $(".attackingcardcomp img").css('position', 'relative').animate({ left: '-1000px'}, function() { $(this).remove(); });
            }, 400);
        }
    }
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
    const arr=turn==0?compdefense:playerdefense
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
    if(turn==0){
    if(playerdeck.length==0 || !checkForSameTier(attackcard))
        flag=false
    }
    else if(turn==1){
        if(compdeck.length==0 ||!checkForSameTier(attackcard))
            flag=false
    }
    return flag
}
function getCurrentAttackCard(){
    src=$(".attackingcardpl").is(':empty')?($(".attackingcardcomp img").attr('src')):($(".attackingcardpl img").attr('src'))
    currAttackCard=src.match(/[0-9]+/)[0]
    return parseInt(currAttackCard)
}
function checkEndOfTurn(){
    temp=turn==0?"comp":"pl"
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
    $(".playercount").html("Players count "+playerdeck.length)
    $(".compcount").html("Computer count "+compdeck.length)
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
function takecard(){
    if(turn==0){
        // $(".attackingcardpl img").attr("src")==""
        let attackcard=playerdeck[0]
        if(!($(".attackingcardpl").is(':empty')) ){
           currentCard=getCurrentAttackCard()
           flag=checkConditionsForTake(currentCard)
           if(flag){
           $(".attackingcardpl img").attr("src","img/tiercards/tempcard"+attackcard+".png").animateCss("animate__flipInY")
           playerdeck.shift()
           playerdeck.push(currentCard)
           }
        }
        // var imgtemp =document.createElement("img");
        // imgtemp.width=200;
        // imgtemp.height=250;
        // imgtemp.src=("img/tiercards/tempcard"+playerdeck[0]+".png");
        // playerdeck.shift()
        //imgtemp.src=("img/tiercards/tempcard"+"0.png");
        //$(".attackingcardpl").append(imgtemp).animateCss("animate__flipInY");
        else if($(".attackingcardpl").is(':empty')){
            var imgtemp =document.createElement("img");
            imgtemp.width=200;
            imgtemp.height=250;
            imgtemp.src=("img/tiercards/tempcard"+playerdeck[0]+".png");
            playerdeck.shift()
            updateDeckCount()
            //imgtemp.src=("img/tiercards/tempcard"+"0.png");
            $(".attackingcardpl").append(imgtemp).animateCss("animate__flipInY");
        }
        endOfTurnFlag=checkEndOfTurn()
        if(endOfTurnFlag){
            console.log("end true")
            checkForDefense()  
            disableclickable()
            enableEndButton()       
    }

    }
    if(turn==1){
        let attackcard=compdeck[0]
        if(!($(".attackingcardcomp").is(':empty')) ){
            currentCard=getCurrentAttackCard()
            flag=checkConditionsForTake(currentCard)
            if(flag){
                setTimeout(()=>{
                    $(".attackingcardpl img").attr("src","img/tiercards/tempcard"+attackcard+".png").animateCss("animate__flipInY")
                },500)
                //sleep(2000);
            //$(".attackingcardpl img").attr("src","img/tiercards/tempcard"+attackcard+".png").animateCss("animate__flipInY")
                playerdeck.shift()
                playerdeck.push(currentCard)
            }
         }
         else if($(".attackingcardpl").is(':empty')){
            var imgtemp =document.createElement("img");
            imgtemp.width=200;
            imgtemp.height=250;
            imgtemp.src=("img/tiercards/tempcard"+compdeck[0]+".png");
            compdeck.shift()
            updateDeckCount()
            //imgtemp.src=("img/tiercards/tempcard"+"0.png");
            $(".attackingcardcomp").append(imgtemp)
            console.log($(".attackingcardcomp img").attr("src")+"its src")
            setTimeout(()=>{
                $(".attackingcardcomp").append(imgtemp).animateCss("animate__flipInY");
            },500)
            //sleep(2000)
        }
    }

}
function initclickable(turn_state){
    if(turn_state==0){
        $(".playersdeck").on("click",takecard)
        //$(".playersdeck").off("click")
        for (let index = 1; index < 4; index++) {
            $(".defensecard"+index+"comp").on("click",beatcard)
        }
    }
}
function disableclickable(){
    if(turn==0){
        $(".playersdeck").off("click")
        for (let index = 1; index < 4; index++) {
            $(".defensecard"+index+"comp").off("click")
        }
    }
}

function newturn(){
    if(turn==1){
     console.log("comp turn")
        $(".result").html("Computer turn");
    }
    else 
        $(".result").html("Your turn");
    initclickable(turn)
    console.log("restoring def " +turn)
    restoreDefense()
    if(turn==1){
        takecard()
        compChooseBeat()
        checkForDefense()
        passturn()
    }
}
function tosscoin(){
    turn=Math.floor(Math.random()*2);
    $(".cointoss").hide();
    // if(turn==1)
    // $(".result").html("Computer turn");
    // else $(".result").html("Your turn");
    window.turn=turn;
    newturn();
}
function canbeat(card){
}
function chooseatackingcard(){
    if(turn==0){
        var img4 =document.createElement("img");
    img4.height=250;
    img4.width=200;
    let attackingcard=playerdeck[0]
    img4.src=("img/tiercards/tempcard"+playerdeck[0]);
    $(".attackingcard").append(img4).animateCss("animate__flipInY")
    setTimeout(() => {
        $(".attackingcard").children("img").remove();
    }, 2000);
    }
    else if(turn==1){
        var img4 =document.createElement("img");
    img4.height=250;
    img4.width=200;
    img4.src=("img/tiercards/tempcard"+"3.png");
    $(".attackingcard").append(img4).animateCss("animate__flipInY")
    setTimeout(() => {
        $(".attackingcard").children("img").remove();
    }, 2000);
    }
}
function fillcardsarray(){
    for (let index = 0; index <5; index++) {
        for (let index2 = 0; index2 < 4; index2++) {
            playerdeck.push(index);
            compdeck.push(index);
        }              
    }
}
function randomshuffle(){
    let currentindex=playerdeck.length;
    let randomindex;
    while(currentindex!=0){
        randomindex=Math.floor(Math.random()*currentindex);
        currentindex--;
        [playerdeck[currentindex],playerdeck[randomindex]]=[playerdeck[randomindex],playerdeck[currentindex]];
        randomindex=Math.floor(Math.random()*currentindex);
        [compdeck[currentindex],compdeck[randomindex]]=[compdeck[randomindex],compdeck[currentindex]]
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