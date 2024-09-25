let context = new (window.AudioContext || window.webkitAudioContext)();
let currentTone = null;  // Store the random tone to compare with user's guess
let attempts = 0;        // Number of attempts to guess correctly
let correctGuesses = 0;  // Number of correct guesses
let totalRounds = 0;     // Total rounds played

// Chromatic scale frequencies (A4 as reference)
const chromaticScale = [
    { note: 'C', frequency: 261.63 },
    { note: 'C#', frequency: 277.18 },
    { note: 'D', frequency: 293.66 },
    { note: 'D#', frequency: 311.13 },
    { note: 'E', frequency: 329.63 },
    { note: 'F', frequency: 349.23 },
    { note: 'F#', frequency: 369.99 },
    { note: 'G', frequency: 392.00 },
    { note: 'G#', frequency: 415.30 },
    { note: 'A', frequency: 440.00 },
    { note: 'A#', frequency: 466.16 },
    { note: 'B', frequency: 493.88 }
];

// Function to get the frequency of a note
function getFrequency(note) {
    for (let i = 0; i < chromaticScale.length; i++) {
        if (chromaticScale[i].note === note) {
            return chromaticScale[i].frequency;
        }
    }
    return 440.00; // Default to A4 if not found
}

// Play a random tone from the chromatic scale
function playRandomTone() {
    let randomIndex = Math.floor(Math.random() * chromaticScale.length);
    currentTone = chromaticScale[randomIndex]; // Store the current random tone
    let pitchAdjustment = document.getElementById('pitch-slider').value;
    let frequency = currentTone.frequency * Math.pow(2, pitchAdjustment / 1200);

    attempts = 0; // Reset attempts for the new round
    document.getElementById('feedback').innerText = "Try to guess the note!";
    document.getElementById('playAgainButton').disabled = false; // Enable play again button

    playTone(frequency);
}

// Play the current tone again
function playCurrentTone() {
    if (currentTone) {
        let pitchAdjustment = document.getElementById('pitch-slider').value;
        let frequency = currentTone.frequency * Math.pow(2, pitchAdjustment / 1200);
        playTone(frequency);
    }
}

// General function to play a tone
function playTone(frequency) {
    let oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 2); // Play for 2 seconds
}

// Function to handle the user's guess
function guessTone(guessedNote) {
    if (!currentTone) {
        alert("Please start a new round first!");
        return;
    }
    attempts++; // Increment attempts for each guess
    if (guessedNote === currentTone.note) {
        correctGuesses++;
        totalRounds++;
        document.getElementById('feedback').innerText = "Correct! The note was " + currentTone.note + ". Start a new round!";
        updateSuccessRate();
        document.getElementById('playAgainButton').disabled = true; // Disable play again after correct guess
        currentTone = null; // Reset the current tone for a new round
    } else {
        document.getElementById('feedback').innerText = "Incorrect. Try again!";
    }
}

// Update the success rate based on rounds and correct guesses
function updateSuccessRate() {
    let successRate = ((correctGuesses / totalRounds) * 100).toFixed(2);
    document.getElementById('success-rate').innerText = "Success Rate: " + successRate + "% (Rounds: " + totalRounds + ")";
}

// Update the pitch adjustment display
document.getElementById('pitch-slider').oninput = function () {
    document.getElementById('pitch-value').innerText = this.value;
}
