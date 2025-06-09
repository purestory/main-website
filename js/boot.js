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
    "Memory Test: 16384M <span class='post-message-highlight-ok'>OK</span>",
    "Initializing USB Controllers .. <span class='post-message-highlight-ok'>Done</span>",
    "Detecting IDE Devices...",
    "  Primary Master: VBOX HARDDISK ATA Device",
    "  Primary Slave: None",
    "  Secondary Master: VBOX CD-ROM ATA Device",
    "  Secondary Slave: None",
    " ",
    "<span class='post-message-highlight-info'>Booting from Hard Disk...</span>",
];
let currentPostMessageIndex = 0;
const postMessageDelay = 250; // ms between each POST message

function showNextPostMessage() {
    if (currentPostMessageIndex < postScreenMessages.length) {
        // Ensure common.js has loaded and postMessagesContainer is available
        if(typeof postMessagesContainer !== 'undefined' && postMessagesContainer) {
            // Use innerHTML to render spans, and \n for newlines within <pre>
            postMessagesContainer.innerHTML += postScreenMessages[currentPostMessageIndex] + '\n';
        }
        currentPostMessageIndex++;
        setTimeout(showNextPostMessage, postMessageDelay);
    } else {
        // This is the existing timeout after the last message
        setTimeout(() => {
            if (typeof postScreen !== 'undefined' && postScreen) {
                postScreen.style.opacity = '0'; // Start fade-out
                setTimeout(() => { // After transition, hide and proceed
                    postScreen.style.display = 'none';
                    // Optional: Reset opacity if POST screen could be shown again, though not current behavior
                    // postScreen.style.opacity = '1';
                    startBootSequence();
                }, 500); // This duration MUST match the CSS transition duration for opacity
            } else {
                startBootSequence(); // Fallback if postScreen isn't defined
            }
        }, 500); // Delay after the last POST message before starting fade-out
    }
}

function startPostScreenSequence() {
    // Ensure common.js has loaded and postScreen is available
    if(typeof postScreen !== 'undefined' && postScreen) {
        postScreen.style.display = 'block';
        if(typeof postMessagesContainer !== 'undefined' && postMessagesContainer) {
            postMessagesContainer.innerHTML = ''; // Clear any previous messages
        }
    }
    currentPostMessageIndex = 0; // Reset for potential re-runs (though not a current feature)
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

let currentMessageIndex = 0;
const numMessages = bootMessages.length;
const totalBootTime = 10000;
const messageInterval = (totalBootTime - 2000) / (numMessages > 1 ? (numMessages -1) : 1) ;

let bootStartTime;
let progressUpdateIntervalId;

function showNextBootMessage() {
    if (currentMessageIndex < numMessages) {
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
