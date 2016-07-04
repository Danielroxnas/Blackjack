
//global variabels
var deck = [];
var cardValues = {
    ace: 11,
    face: 10
};
var dealerThenToStop = {
    min: 17
};
var user = {
    player: { name: "player", score: 0 ,hasAce:0},
    dealer: { name: "dealer", score: 0,hasAce:0 },
    draw: { name: "draw" }
};

//card class
function card(value, suit) {
    this.value = value;
    this.suit = suit;
}

//First dealing, 
function startDeck() {
  
    var value = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var suit = ["clubs", "diamonds", "hearts", "spades"];
    for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < suit.length; j++) {
            deck.push(new card(value[i], suit[j]));
        }
    }
    deck = mixDeck(deck);
}

//start function
function start() {
    reset();
    startDeck();
    var card = deal();
    valueCounter(card, user.player);
    card = deal();
    valueCounter(card, user.dealer);
    card = deal();
    valueCounter(card, user.player);
    disabledButtons(true, false, false);

    //check if player get blackjack on the first draw
    if (user.player.score === 21) {
        lose(user.dealer);
    }
}

//then player pressed stand and its dealers turn
function dealersTurn() {
    //draw a new card as long as dealer has lover score then 17
    while (dealerThenToStop.min >= user.dealer.score) {
        var card = deal();
        valueCounter(card, user.dealer);
    }
  
    if (user.dealer.score <= 21) {
        //Draw
        if (user.dealer.score === user.player.score) {
            lose(user.draw);

            return;
        }
        if (user.dealer.score > user.player.score) lose(user.player); //If dealer has more score, dealer win
        else lose(user.dealer);//else Players win
    }
    else {//if has ace and over 21, count ace a s 1
        if (user.dealer.hasAce > 0){
            user.dealer.score -= (cardValues.ace - 1);
            user.dealer.hasAce--;
            dealersTurn();//restart the loop
        }
        else lose(user.dealer);
    }

        

}

//Count the value to the scoreboard
function valueCounter(card, currentPlayer) {
    var result = currentPlayer.score;
    switch (card.value) {
        case "A":
            result = result + parseInt(cardValues.ace);
            currentPlayer.hasAce++;
            break;
        case "J":
        case "Q":
        case "K":
            result = result + parseInt(cardValues.face);
            break;
        default:
            result = result + parseInt(card.value);
    }
    currentPlayer.score = result;
    addCard(card, currentPlayer);
    displayScore()
}

//Display the scoreboard
function displayScore() {
    document.getElementById("playerScore").innerText = user.player.score;
    document.getElementById("dealerScore").innerText = user.dealer.score;
}

//add the card image
function addCard(card, currentUser) {
    var img = new Image;
    img.src = "images/" + card.value + "_of_" + card.suit + ".png";
    img.className = "cardImg";
    if (currentUser.name == "dealer") {
        document.getElementById("dealerDiv").appendChild(img);
    }
    else {
        document.getElementById("playerDiv").appendChild(img);
        document.getElementById("playerDiv").style.paddingTop =0;
    }
}

//Shuffel the deck
function mixDeck(tmpDeck) {
    for (var i = 0; i < tmpDeck.length; i++) {
        var rmd = Math.floor(Math.random() * tmpDeck.length);
        var temp = tmpDeck[i]; //origianl deck position
        tmpDeck[i] = tmpDeck[rmd]; //replace original position with randomized index
        tmpDeck[rmd] = temp; // replace randomized index with the old original index
    }
    return tmpDeck;
}

//Pick the first card and remove it from the array
function deal() {
    if (deck.length > 0) {
        var card = deck.shift();
        return card;
    }
    return null;
}

//let the dealer make the turns
function stand() {
    dealersTurn();
}
//Draw a card 
function hit() {
    var card = deal();
    valueCounter(card, user.player);
    //check if the score is over 21
    if (user.player.score > 21) {
        if (user.player.hasAce > 0) {//check if the score has a ace
            user.player.score -= (cardValues.ace - 1);
            user.player.hasAce--;
        }
        if (user.player.score > 21) lose(user.player);
    }
    displayScore()
}

function lose(currentUser) {
    // write out all the winnertext
    if (currentUser.name == "draw") document.getElementById("winner").innerText = "Tie";
    if (currentUser.name === "dealer") document.getElementById("winner").innerText = "Winner: Player";
    if (currentUser.name === "player") document.getElementById("winner").innerText = "Winner: Dealer";
    disabledButtons(false, true, true);
}
//diasable the buttons whos not in use.
function disabledButtons(deal, hit, stand) {
    document.getElementById("dealBtn").disabled = deal;
    document.getElementById("hitBtn").disabled = hit;
    document.getElementById("standBtn").disabled = stand;
}
//Clear all the data.
function reset() {

    deck = [];//Clear deck
    user.player.score = 0;//set score to 0
    user.dealer.score = 0;
    user.player.hasAce = 0;
    user.dealer.hasAce = 0;
    document.getElementById("winner").innerText = "";//clear winnertext
    //clear all card images.
    var playerDiv = document.getElementById("playerDiv");
    while (playerDiv.hasChildNodes()) {
        playerDiv.removeChild(playerDiv.firstChild);
    }
    var dealerDiv = document.getElementById("dealerDiv");
    while (dealerDiv.hasChildNodes()) {
        dealerDiv.removeChild(dealerDiv.firstChild);
    }

}


