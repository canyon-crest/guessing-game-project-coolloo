// time
date.textContent = time();

// global variables
let score, answer, level;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
const timeArr = [];
let fastestTime = Infinity;
let stopwatchInterval;
let currentGameStartTime;

if (stopwatch) stopwatch.textContent = "Time: 0:00.00";
if (fastTime) fastTime.textContent = "Fastest Time: --";
if (avgTime) avgTime.textContent = "Average Time: --";

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
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = d.getDate();

    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    if (day % 10 === 2 && day !== 12) suffix = "nd";
    if (day % 10 === 3 && day !== 13) suffix = "rd";
    
    return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
}
function updateStopwatch() {
    const now = new Date().getTime();
    const elapsed = now - currentGameStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = Math.floor((elapsed % 1000) / 10);
    stopwatch.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}
function getRating(score, level) {
    const percentage = (score / level) * 100;
    
    if(score === 1) {
        return "PERFECT!";
    } else if(percentage <= 15) {
        return "GREAT!";
    } else if(percentage <= 30) {
        return "Good!";
    } else if(percentage <= 50) {
        return "Bad!";
    } else {
        return "Terrible!";
    }
}
function updateTemperature(userGuess) {
    const difference = Math.abs(userGuess - answer);
    const range = level;
    const percentage = (difference / range) * 100;

    const marker = document.getElementById('tempMarker');
    marker.style.left = (100 - percentage) + '%';

    const guessItem = document.createElement('span');
    guessItem.className = 'guess-item';
    guessItem.style.background = percentage <= 10 ? '#ff6b6b' : 
                                percentage <= 20 ? '#ffd93d' : '#4dabf7';
    guessItem.textContent = userGuess;
    document.getElementById('guessHistory').appendChild(guessItem);
}
function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;

    document.getElementById('guessHistory').innerHTML = '';

    currentGameStartTime = new Date().getTime();
    if (stopwatchInterval) clearInterval(stopwatchInterval);
    stopwatch.textContent = "Time: 0:00.00";
    stopwatchInterval = setInterval(updateStopwatch, 10);
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = parseInt(levelArr[i].value);
        }
    }
    answer = Math.floor(Math.random()*level)+1;
    msg.textContent = "Guess a number between 1-" + level;
    guess.placeholder = "Enter your guess";
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
        let tries = score === 1 ? "try" : "tries";
        let rating = getRating(score, level);

        const endTime = new Date().getTime();
        const gameTime = (endTime - currentGameStartTime) / 1000;
        timeArr.push(gameTime);

        if (gameTime < fastestTime) {
            fastestTime = gameTime;
            const minutes = Math.floor(fastestTime / 60);
            const seconds = (fastestTime % 60).toFixed(2);
            fastTime.textContent = `Fastest Time: ${minutes}:${seconds.padStart(5, '0')}`;
        }

        const avgGameTime = timeArr.reduce((a, b) => a + b) / timeArr.length;
        const avgMinutes = Math.floor(avgGameTime / 60);
        const avgSeconds = (avgGameTime % 60).toFixed(2);
        avgTime.textContent = `Average Time: ${avgMinutes}:${avgSeconds.padStart(5, '0')}`;
        
        msg.textContent = `Correct! It took ${playerNameText} ${score} ${tries}. ${rating} (Time: ${gameTime.toFixed(2)}s)`;

        clearInterval(stopwatchInterval);
        
        updateScore();
        reset();
        return;
    }
    
    // Update temperature visualization
    updateTemperature(userGuess);
    
    const difference = Math.abs(userGuess - answer);
    const range = level;
    const percentage = (difference / range) * 100;
    
    let temperature;
    if(percentage <= 10) {
        temperature = "HOT 🔥";
    } else if(percentage <= 20) {
        temperature = "Warm 😊";
    } else {
        temperature = "Cold ❄️";
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
    stopwatch.textContent = "Time: 0:00.00";
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

    clearInterval(stopwatchInterval);
    stopwatch.textContent = "Time: 0:00.00";
    
    updateGiveUpScore();
    reset();
}