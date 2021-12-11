const gameContainer = document.getElementById("game");

const COLORS = [
	"red",
	"blue",
	"green",
	"orange",
	"purple",
	"red",
	"blue",
	"green",
	"orange",
	"purple",
];

const scoreSpan = document.getElementById("score");
const yourScoreP = document.getElementById("yourScoreP");
const lowScoreSpan = document.getElementById("lowScore");
const lowScoreP = document.getElementById("lowScoreP");
const startGameButton = document.getElementById("startGame");
const restartGameButton = document.getElementById("restartGame");
let lowScore = parseInt(localStorage.lowScore);
let cardsPicked = [];
let matchedCards = [];
let score = 0;

if (!isNaN(lowScore)) {
	lowScoreSpan.innerText = lowScore;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement("div");

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener("click", handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	const clickedCard = event.target;
	if (cardsPicked.length < 2 && cardsPicked.indexOf(clickedCard) === -1) {
		clickedCard.style.backgroundColor = clickedCard.className;
		clickedCard.classList.toggle("flip");
		cardsPicked.push(clickedCard);

		if (cardsPicked.length === 2) {
			//increment score
			score++;
			scoreSpan.innerText = score;

			let cardOne = cardsPicked[0];
			let cardTwo = cardsPicked[1];
			let colorOne = cardOne.className;
			let colorTwo = cardTwo.className;

			//Check if the cards don't match
			if (colorOne != colorTwo) {
				setTimeout(function () {
					for (let card of cardsPicked) {
						if (matchedCards.indexOf(card.className) === -1) {
							card.style.backgroundColor = "transparent";
							card.classList.toggle("flip");
						}
					}
					cardsPicked = [];
				}, 1000);
			} else {
				//If the cards don't match add the color to the matchedCards array and remove the event listener for those cards
				matchedCards.push(colorOne);
				for (let card of cardsPicked) {
					card.removeEventListener("click", handleCardClick);
				}
				cardsPicked = [];
				//Check if game is over
				if (matchedCards.length === COLORS.length / 2) {
					restartGameButton.style.display = "inline";
					//Set low score in localStorage
					if (isNaN(lowScore) || score < lowScore) {
						localStorage.setItem("lowScore", score);
						lowScoreSpan.innerText = score;
					}
				}
			}
		}
	}
}

function generateCards() {
	let shuffledColors = shuffle(COLORS);
	createDivsForColors(shuffledColors);
	restartGameButton.style.display = "none";
}

function startGame() {
	generateCards();
	startGameButton.removeEventListener("click", startGame);
	startGameButton.style.display = "none";
	yourScoreP.style.display = "block";
}

startGameButton.addEventListener("click", startGame);

restartGameButton.addEventListener("click", function () {
	//Remove divs from previous game
	//Code adpated from StackOverflow example
	//https://stackoverflow.com/questions/3450593/how-do-i-clear-the-content-of-a-div-using-javascript
	while (gameContainer.firstChild) {
		gameContainer.removeChild(gameContainer.firstChild);
	}
	cardsPicked = [];
	matchedCards = [];
	score = 0;
	lowScore = parseInt(localStorage.lowScore);
	scoreSpan.innerText = score;
	lowScoreSpan.innerText = lowScore;
	generateCards();
});
