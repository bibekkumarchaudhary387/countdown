let previousValues = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
let targetDate = null;
let countdownInterval = null;

function saveToLocalStorage(date) {
    localStorage.setItem('countdownDate', date);
}

function loadFromLocalStorage() {
    return localStorage.getItem('countdownDate');
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
        animateFlip('months', 0);
        animateFlip('days', 0);
        animateFlip('hours', 0);
        animateFlip('minutes', 0);
        animateFlip('seconds', 0);
        document.getElementById('target-info').textContent = 'Time Reached!';
        clearInterval(countdownInterval);
        return;
    }
    
    const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (months !== previousValues.months) animateFlip('months', months);
    if (days !== previousValues.days) animateFlip('days', days);
    if (hours !== previousValues.hours) animateFlip('hours', hours);
    if (minutes !== previousValues.minutes) animateFlip('minutes', minutes);
    if (seconds !== previousValues.seconds) animateFlip('seconds', seconds);
    
    previousValues = { months, days, hours, minutes, seconds };
}

function startCountdown() {
    const dateInput = document.getElementById('target-date').value;
    if (!dateInput) {
        alert('Please select a date');
        return;
    }
    
    targetDate = new Date(dateInput);
    const now = new Date();
    
    if (targetDate <= now) {
        alert('Please select a future date');
        return;
    }
    
    saveToLocalStorage(dateInput);
    document.getElementById('target-info').textContent = `Countdown to ${targetDate.toDateString()}`;
    document.getElementById('input-section').style.display = 'none';
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

function initializeCountdown() {
    const savedDate = loadFromLocalStorage();
    if (savedDate) {
        targetDate = new Date(savedDate);
        const now = new Date();
        
        if (targetDate > now) {
            document.getElementById('target-info').textContent = `Countdown to ${targetDate.toDateString()}`;
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
    document.getElementById('target-date').value = '';
});

initializeCountdown();