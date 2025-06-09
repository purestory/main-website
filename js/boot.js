// --- DOMContentLoaded will handle ensuring these are available ---
// Selectors that might be needed by boot sequence
// const postScreen = document.getElementById('post-screen'); // Now in common.js
// const postMessagesContainer = document.getElementById('postMessages'); // Now in common.js
// const bootScreen = document.getElementById('boot-screen'); // Now in common.js
// const desktop = document.querySelector('.desktop'); // Now in common.js
// const bootMessageText = document.getElementById('bootMessageText'); // Now in common.js
// const bootProgressBar = document.getElementById('bootProgressBar'); // Now in common.js
// const bootProgressText = document.getElementById('bootProgressText'); // Now in common.js

// --- POST Screen Sequence Logic ---
const postScreenMessages = [
    "AMIBIOS(C) 2023 American Megatrends Inc.",
    "CPU: Generic x86-64 Processor @ 3.0GHz",
    "Memory Test: 16384M OK",
    "Initializing USB Controllers .. Done",
    "Detecting IDE Devices...",
    "  Primary Master: VBOX HARDDISK ATA Device",
    "  Primary Slave: None",
    "  Secondary Master: VBOX CD-ROM ATA Device",
    "  Secondary Slave: None",
    " ",
    "Booting from Hard Disk...",
];
let currentPostMessageIndex = 0;
const postMessageDelay = 250; // ms between each POST message

function showNextPostMessage() {
    if (currentPostMessageIndex < postScreenMessages.length) {
        // Ensure common.js has loaded and postMessagesContainer is available
        if(typeof postMessagesContainer !== 'undefined' && postMessagesContainer) {
            postMessagesContainer.textContent += postScreenMessages[currentPostMessageIndex] + '\n';
        }
        currentPostMessageIndex++;
        setTimeout(showNextPostMessage, postMessageDelay);
    } else {
        setTimeout(() => {
            if(typeof postScreen !== 'undefined' && postScreen) postScreen.style.display = 'none';
            startBootSequence();
        }, 500);
    }
}

function startPostScreenSequence() {
    // Ensure common.js has loaded and postScreen is available
    if(typeof postScreen !== 'undefined' && postScreen) postScreen.style.display = 'block';
    showNextPostMessage();
}

// --- Main Boot Sequence Logic ---
const bootMessages = [
    "POST: System Check...",
    "Memory Test: 16384MB OK",
    "Initializing USB Controllers...",
    "AHCI Driver Loaded.",
    "Loading Kernel (core.sys)...",
    "Starting Windows Services...",
    "Welcome!"
];

let currentMessageIndex = 0; // This was 'currentMessageIndex' for boot, distinct from 'currentPostMessageIndex'
const numMessages = bootMessages.length;
const totalBootTime = 10000;
const messageInterval = (totalBootTime - 2000) / (numMessages > 1 ? (numMessages -1) : 1) ;

let bootStartTime;
let progressUpdateIntervalId;

function showNextBootMessage() { // This was 'showNextMessage' for boot messages
    if (currentMessageIndex < numMessages) { // ensure using the correct message index
        if(typeof bootMessageText !== 'undefined' && bootMessageText) bootMessageText.textContent = bootMessages[currentMessageIndex];
        currentMessageIndex++;
        if (currentMessageIndex < numMessages) {
           setTimeout(showNextBootMessage, messageInterval);
        }
    }
}

function updateBootProgress() {
    const elapsedTime = Date.now() - bootStartTime;
    let progressPercent = Math.min(100, Math.floor((elapsedTime / totalBootTime) * 100));
    if(typeof bootProgressText !== 'undefined' && bootProgressText) bootProgressText.textContent = `${progressPercent}%`;

    if (progressPercent >= 100) {
        clearInterval(progressUpdateIntervalId);
    }
}

function startBootSequence() {
    if(typeof bootScreen !== 'undefined' && bootScreen) bootScreen.style.display = 'flex';
    bootStartTime = Date.now();
    if(typeof bootProgressBar !== 'undefined' && bootProgressBar) {
        bootProgressBar.style.transition = `width ${totalBootTime / 1000}s linear`;
        requestAnimationFrame(() => {
            bootProgressBar.style.width = '100%';
        });
    }

    currentMessageIndex = 0;
    showNextBootMessage();
    progressUpdateIntervalId = setInterval(updateBootProgress, 100);

    setTimeout(() => {
        clearInterval(progressUpdateIntervalId);
        if(typeof bootProgressText !== 'undefined' && bootProgressText) bootProgressText.textContent = '100%';
        if(typeof bootScreen !== 'undefined' && bootScreen) bootScreen.classList.add('hidden');
        if(typeof desktop !== 'undefined' && desktop) desktop.classList.add('visible');

        setTimeout(() => {
            if(typeof bootScreen !== 'undefined' && bootScreen) bootScreen.style.display = 'none';
        }, 1000);
    }, totalBootTime);
}

// Initial call to start the entire boot process
// This assumes this script is loaded after common.js and within DOMContentLoaded or with defer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPostScreenSequence);
} else {
    startPostScreenSequence();
}
