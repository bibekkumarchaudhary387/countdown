let previousValues = { hours: 0, minutes: 0, seconds: 0 };
let targetDate = null;
let countdownInterval = null;

function saveToLocalStorage(hours, minutes) {
    localStorage.setItem('countdownHours', hours);
    localStorage.setItem('countdownMinutes', minutes);
}

function loadFromLocalStorage() {
    const hours = localStorage.getItem('countdownHours');
    const minutes = localStorage.getItem('countdownMinutes');
    return hours && minutes ? { hours: parseInt(hours), minutes: parseInt(minutes) } : null;
}

function animateFlip(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element.textContent !== newValue.toString()) {
        element.classList.add('flip');
        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('flip');
        }, 300);
    }
}

function updateCountdown() {
    if (!targetDate) return;
    
    const now = new Date();
    const timeDiff = targetDate - now;
    
    if (timeDiff <= 0) {
        animateFlip('hours', 0);
        animateFlip('minutes', 0);
        animateFlip('seconds', 0);
        document.getElementById('target-info').textContent = 'Time Reached!';
        clearInterval(countdownInterval);
        return;
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (hours !== previousValues.hours) animateFlip('hours', hours);
    if (minutes !== previousValues.minutes) animateFlip('minutes', minutes);
    if (seconds !== previousValues.seconds) animateFlip('seconds', seconds);
    
    previousValues = { hours, minutes, seconds };
}

function startCountdown() {
    const hoursInput = document.getElementById('target-hours').value;
    const minutesInput = document.getElementById('target-minutes').value;
    
    if (!hoursInput && !minutesInput) {
        alert('Please enter hours or minutes');
        return;
    }
    
    const hours = parseInt(hoursInput) || 0;
    const minutes = parseInt(minutesInput) || 0;
    
    if (hours === 0 && minutes === 0) {
        alert('Please enter a time greater than 0');
        return;
    }
    
    const now = new Date();
    targetDate = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000));
    
    saveToLocalStorage(hours, minutes);
    document.getElementById('target-info').textContent = `${hours}h ${minutes}m countdown started`;
    document.getElementById('input-section').style.display = 'none';
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

function initializeCountdown() {
    const saved = loadFromLocalStorage();
    if (saved) {
        const now = new Date();
        targetDate = new Date(now.getTime() + (saved.hours * 60 * 60 * 1000) + (saved.minutes * 60 * 1000));
        
        if (targetDate > now) {
            document.getElementById('target-info').textContent = `${saved.hours}h ${saved.minutes}m countdown`;
            countdownInterval = setInterval(updateCountdown, 1000);
            updateCountdown();
        } else {
            document.getElementById('input-section').style.display = 'flex';
        }
    } else {
        document.getElementById('input-section').style.display = 'flex';
    }
}

document.getElementById('start-countdown').addEventListener('click', startCountdown);
document.getElementById('change-date-btn').addEventListener('click', () => {
    document.getElementById('input-section').style.display = 'flex';
    document.getElementById('target-hours').value = '';
    document.getElementById('target-minutes').value = '';
});

initializeCountdown();