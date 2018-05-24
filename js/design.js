/*****************************************
* create the array to hold all the icons *
*****************************************/
const icons = ["fas fa-crown", "fas fa-crown", "fab fa-fly", "fab fa-fly", "fas fa-frog", "fas fa-frog", "fab fa-galactic-republic", "fab fa-galactic-republic", "fab fa-keybase", "fab fa-keybase", "fab fa-qq", "fab fa-qq", "fas fa-robot", "fas fa-robot", "fas fa-user-astronaut", "fas fa-user-astronaut"];

//global variables
const cardsContainer = document.querySelector(".deck");
let openedCards = [];
let matchedCards = [];
let firstClick = true;

//variables for the timer
const timer = document.querySelector("timer");
let second, minute,
    totalTime = 0;
let interval;    

/*****************************************
* create the function to call the moves  *
*****************************************/

const movesContainer = document.querySelector(".moves");
let moves = 0;

movesContainer.innerHTML = 0;

function addMoves() {
    moves++;
    movesContainer.innerHTML = moves;

    //set the rating
    rating();
}

/***************************************
* create the function to call the time *
***************************************/

function startTime() { 

    interval = setInterval(function() {
        document.getElementById("timer").innerHTML = `${("0" + minute).slice(-2)} : ${("0" + second).slice(-2)}`;

        second++;

        if(second == 60) {
            minute++;
            second = 0;
        }
    }, 1000);
}

/******************************
* create the function to rate *
*******************************/

const starsContainer = document.querySelector(".stars");
const gem = `<li><i class="fa fa-gem"></i></li>`;
starsContainer.innerHTML = gem + gem + gem;

function rating() {

    if(moves > 10 && moves < 15) {
        starsContainer.innerHTML = gem + gem + gem;

    } else if (moves > 16 && moves < 20) {
        starsContainer.innerHTML = gem + gem;

    } else if(moves > 20) {
        starsContainer.innerHTML = gem;
    }
}

/*************************************
* create the restart button function *
*************************************/
const restartBtn = document.querySelector(".restart");

restartBtn.addEventListener("click", function() {

    //initialize the game
    init();

    // start the game again
    repeat();
    
});

/**********************************
 * create the card listener event *
***********************************/ 

function click(card) {

    // Card Click Event
    card.addEventListener("click", function() {
        
        if(firstClick) {
            //start timer
            startTime();
            firstClick = false;
        }

        const currentCard = this;
        const previousCard = openedCards[0];
        
        // We have an existing OPENED card
        if(openedCards.length === 1) {

            card.classList.add("open", "show", "disable");
            openedCards.push(this);

            // We should compare our 2 opened cards!
            compare(currentCard, previousCard);

        } else {
        // We don't have any opened cards
            currentCard.classList.add("open", "show", "disable");
            openedCards.push(this);
        }
        
    });
}

/******************
* start function  *
******************/

function start() {

    //initialize the game 
    init();

    //start the "click" function
    reset();
}

/******************
* init function  *
******************/

function init() {

    //shuffle the icon list
    let shuffleIcons = shuffle(icons);

    for(let i = 0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.innerHTML = `<i class="${icons[i]}"></i>`;
        cardsContainer.appendChild(card);

        //add click event to each card
        click(card);

        //reset timer
        minute = 0;
        second = 0;
        document.getElementById("timer").innerHTML = `${("0" + minute).slice(-2)} : ${("0" + second).slice(-2)}`;
        clearInterval(interval);
    }

}

/******************************
* create the shuffle function *
*******************************/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/***************************************
* create the match/ unmatched function *
****************************************/

function compare(currentCard, previousCard) {

    //matcher
    if(currentCard.innerHTML === previousCard.innerHTML) {

        //matched
        currentCard.classList.add("match");
        previousCard.classList.add("match");

        // add the current and previous card to the array
        matchedCards.push(currentCard, previousCard);

        openedCards = [];

        //check if the game is over
        endGame();

    } else {
        setTimeout(function() {
            
            currentCard.classList.remove("open", "show", "disable");
            previousCard.classList.remove("open", "show", "disable");

        }, 500);

        openedCards = [];
    }

    // add new move
    addMoves();

}

/********************************
* create the end game function  *
********************************/

function endGame() {

    if(matchedCards.length === icons.length) {
        
        //show modal
        showModal();
    }
}

/*****************************
* create the Modal function  *
*****************************/

const modal = document.querySelector("#modal");
const playAgain = document.querySelector("#playAgain");

function showModal() {

    //display the modal
    modal.style.display = "block";

    // add moves to the modal
    const modalMoves = document.querySelector(".modal_moves");
    modalMoves.innerHTML = movesContainer.innerHTML;

    // add rate
    const modalStars = document.querySelector(".modal_stars");
    modalStars.innerHTML = starsContainer.innerHTML;

    // stopTimer
    clearInterval(interval);

    // add time to modal
    const modalTime = document.querySelector(".modal_time");
    modalTime.innerHTML = timer.innerHTML;
}

/*****************************************************
* create the event listener to the play again button *
*****************************************************/

playAgain.addEventListener("click", function() {

    //hide the modal 
    modal.style.display = "none";
    
    //initialize the game
    repeat();
});

/******************
* repeat function *
******************/

function repeat() {
    cardsContainer.innerHTML = "";

    //reset the current values
    reset();

    //start the game again
    start();
}


/****************************
* create the reset function *
****************************/

function reset() {
    matchedCards = [];
    openedCards = [];
    moves = 0;
    movesContainer.innerHTML = "0";
    clearInterval(interval);
    firstClick = true;  
    starsContainer.innerHTML = gem + gem + gem;
    minute = 0;
    second = 0;
    totalTime = 0;
    document.getElementById("timer").innerHTML = `${("0" + minute).slice(-2)} : ${("0" + second).slice(-2)}`;
}

// start the game for the first time!
start();