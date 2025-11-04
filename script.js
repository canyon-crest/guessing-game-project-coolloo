// time
date.textContent = time();

// global variables
let score, answer, level;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// event listener
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);
submitBtn.addEventListener("click", function() {
    let name = nameInput.value;
    if(nameSubmit(name)){
        playerName.textContent = "Player: " + name.charAt(0).toUpperCase() + name.slice(1);
    }
});

function nameSubmit(nameInput){
    if(nameInput == "" || !nameInput){
        msg.textContent = "Invalid name, try again.";
        nameTitle.textContent = "Enter Your Name";
        return false;
    }
    nameTitle.textContent = "Enter Your Name";
    msg.textContent = "Select a Level";
    return true;
}
function time(){
    let d = new Date();
    // concatenate date
    let str = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
    // update here
    return str;
}
function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = parseInt(levelArr[i].value);
        }
    }
    answer = Math.floor(Math.random()*level)+1;
    msg.textContent = "Guess a number between 1-" + level;
    guess.placeholder = answer;
    score = 0;
}
function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Invalid, guess a number.";
        return;
    }
    score++;
    
    if(userGuess === answer){
        const playerNameText = nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1);
        if(score == 1) {
            msg.textContent = "Correct! It took " + playerNameText + " " + score + " try.";
        } else {
            msg.textContent = "Correct! It took " + playerNameText + " " + score + " tries.";
        }
        updateScore();
        reset();
        return;
    }
    
    const difference = Math.abs(userGuess - answer);
    const range = level;
    const percentage = (difference / range) * 100;
    
    let temperature;
    if(percentage <= 5) {
        temperature = "HOT! 🔥";
    } else if(percentage <= 15) {
        temperature = "Warm";
    } else {
        temperature = "Cold";
    }
    
    if(userGuess < answer){
        msg.textContent = "Too low - " + temperature;
    } else {
        msg.textContent = "Too high - " + temperature;
    }
}
function reset(){
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    scoreArr.push(score);
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    scoreArr.sort((a, b) => a - b);
    const lb = document.getElementsByName("leaderboard");

    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}
function updateGiveUpScore() {
    scoreArr.sort((a, b) => a - b);
    const lb = document.getElementsByName("leaderboard");
    
    for(let i = 0; i < lb.length; i++) {
        if(i < scoreArr.length) {
            lb[i].textContent = scoreArr[i];
        }
    }
}
function giveUp(){
    const playerNameText = nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1);
    msg.textContent = playerNameText + " gave up. The answer was " + answer + ".";
    score = level;
    scoreArr.push(score);
    updateGiveUpScore();
    reset();
    giveUpBtn.disabled = true;
}