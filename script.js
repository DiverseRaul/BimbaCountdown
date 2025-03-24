// Bimba Countdown JavaScript

// DOM Elements
const COUNTDOWN_FORM = document.getElementById('countdown-form');
const EVENT_NAME_INPUT = document.getElementById('event-name');
const EVENT_DESCRIPTION_INPUT = document.getElementById('event-description');
const DATE_TIME_INPUT = document.getElementById('date-time');
const BACKGROUND_INPUTS = document.querySelectorAll('input[name="background"]');
const COUNTDOWNS_LIST = document.getElementById('countdowns-list');
const DAYS_ELEMENT = document.getElementById('days');
const HOURS_ELEMENT = document.getElementById('hours');
const MINUTES_ELEMENT = document.getElementById('minutes');
const SECONDS_ELEMENT = document.getElementById('seconds');
const DISPLAY_EVENT_NAME = document.getElementById('display-event-name');
const DISPLAY_DESCRIPTION = document.getElementById('display-description');
const DISPLAY_TASKS = document.getElementById('display-tasks');
const TASKS_DISPLAY = document.getElementById('tasks-display');
const HOME_BTN = document.getElementById('home-btn');
const COUNTDOWNS_BTN = document.getElementById('countdowns-btn');
const WORLD_CLOCK_BTN = document.getElementById('world-clock-btn');
const NEW_COUNTDOWN_BTN = document.getElementById('new-countdown-btn');
const CREATE_FIRST_BTN = document.getElementById('create-first-btn');
const SHARE_BTN = document.getElementById('share-btn');
const BACK_TO_LIST_BTN = document.getElementById('back-to-list-btn');
const DELETE_BTN = document.getElementById('delete-btn');
const EDIT_BTN = document.getElementById('edit-btn');
const THEME_TOGGLE = document.getElementById('theme-toggle');
const MOON_ICON = document.getElementById('moon-icon');
const SUN_ICON = document.getElementById('sun-icon');
const EDIT_MODAL = document.getElementById('edit-modal');
const CLOSE_MODAL_BTN = document.getElementById('close-modal-btn');
const CANCEL_EDIT_BTN = document.getElementById('cancel-edit-btn');
const EDIT_FORM = document.getElementById('edit-form');
const EDIT_EVENT_NAME = document.getElementById('edit-event-name');
const EDIT_EVENT_DESCRIPTION = document.getElementById('edit-event-description');
const EDIT_DATE_TIME = document.getElementById('edit-date-time');
const EDIT_BACKGROUND_INPUTS = document.querySelectorAll('input[name="edit-background"]');
const EDIT_TASK_INPUT = document.getElementById('edit-task-input');
const EDIT_ADD_TASK_BTN = document.getElementById('edit-add-task-btn');
const EDIT_TASKS_LIST = document.getElementById('edit-tasks-list');

// World Clock Elements
const TIMEZONE_SELECT = document.getElementById('timezone-select');
const ADD_TIMEZONE_BTN = document.getElementById('add-timezone-btn');
const CURRENT_TIME = document.getElementById('current-time');
const CURRENT_DATE = document.getElementById('current-date');
const CURRENT_TIMEZONE = document.getElementById('current-timezone');
const TIMEZONE_CLOCKS = document.getElementById('timezone-clocks');
const CLOCK_HOUR = document.querySelector('.clock-hour');
const CLOCK_MINUTE = document.querySelector('.clock-minute');
const CLOCK_SECOND = document.querySelector('.clock-second');

// Screens
const CREATE_SCREEN = document.getElementById('create-screen');
const COUNTDOWNS_SCREEN = document.getElementById('countdowns-screen');
const COUNTDOWN_VIEW_SCREEN = document.getElementById('countdown-view-screen');
const WORLD_CLOCK_SCREEN = document.getElementById('world-clock-screen');

// Global variables
let ALL_COUNTDOWNS = [];
let ACTIVE_COUNTDOWN_ID = null;
let COUNTDOWN_INTERVAL = null;
let CURRENT_TASKS = [];
let EDIT_TASKS = [];
let SAVED_TIMEZONES = [];
let CLOCK_INTERVAL = null;

// Initialize the app
function init() {
    loadCountdowns();
    loadSavedTimezones();
    updateMinDateTime();
    setupEventListeners();
    applyTheme();
    setupTasksInput();
    startWorldClock();
}

// Set min date-time to current date-time
function updateMinDateTime() {
    const NOW = new Date();
    const YEAR = NOW.getFullYear();
    const MONTH = String(NOW.getMonth() + 1).padStart(2, '0');
    const DAY = String(NOW.getDate()).padStart(2, '0');
    const HOURS = String(NOW.getHours()).padStart(2, '0');
    const MINUTES = String(NOW.getMinutes()).padStart(2, '0');
    
    const MIN_DATE_TIME = `${YEAR}-${MONTH}-${DAY}T${HOURS}:${MINUTES}`;
    DATE_TIME_INPUT.min = MIN_DATE_TIME;
    DATE_TIME_INPUT.value = MIN_DATE_TIME;
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    HOME_BTN.addEventListener('click', showCreateScreen);
    COUNTDOWNS_BTN.addEventListener('click', showCountdownsScreen);
    WORLD_CLOCK_BTN.addEventListener('click', showWorldClockScreen);
    NEW_COUNTDOWN_BTN.addEventListener('click', showCreateScreen);
    if (CREATE_FIRST_BTN) {
        CREATE_FIRST_BTN.addEventListener('click', showCreateScreen);
    }
    BACK_TO_LIST_BTN.addEventListener('click', showCountdownsScreen);
    
    // Form submission
    COUNTDOWN_FORM.addEventListener('submit', handleFormSubmit);
    
    // Delete countdown
    DELETE_BTN.addEventListener('click', handleDeleteCountdown);
    
    // Share countdown
    SHARE_BTN.addEventListener('click', handleShareCountdown);
    
    // Edit countdown
    EDIT_BTN.addEventListener('click', openEditModal);
    CLOSE_MODAL_BTN.addEventListener('click', closeEditModal);
    CANCEL_EDIT_BTN.addEventListener('click', closeEditModal);
    EDIT_FORM.addEventListener('submit', handleEditFormSubmit);
    
    // Theme toggle
    THEME_TOGGLE.addEventListener('click', toggleTheme);
    
    // Add task button in create form
    document.querySelector('.add-task-btn').addEventListener('click', addTask);
    
    // Edit add task button
    EDIT_ADD_TASK_BTN.addEventListener('click', addEditTask);
    
    // World Clock
    ADD_TIMEZONE_BTN.addEventListener('click', addTimezone);
    TIMEZONE_SELECT.addEventListener('change', updateCurrentTimezone);
}

// Setup tasks input functionality
function setupTasksInput() {
    // Create form task input
    const TASK_INPUT = document.querySelector('.task-input');
    TASK_INPUT.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
    
    // Edit form task input
    EDIT_TASK_INPUT.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addEditTask();
        }
    });
}

// Add a task to the create form
function addTask() {
    const TASK_INPUT = document.querySelector('.task-input');
    const TASK_TEXT = TASK_INPUT.value.trim();
    
    if (TASK_TEXT) {
        CURRENT_TASKS.push(TASK_TEXT);
        renderTasks();
        TASK_INPUT.value = '';
        TASK_INPUT.focus();
    }
}

// Render tasks in the create form
function renderTasks() {
    const TASKS_LIST = document.getElementById('tasks-list');
    TASKS_LIST.innerHTML = '';
    
    CURRENT_TASKS.forEach((task, index) => {
        const TASK_ITEM = document.createElement('div');
        TASK_ITEM.className = 'task-item';
        TASK_ITEM.innerHTML = `
            <span>${task}</span>
            <button type="button" class="remove-task-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"/></svg>
            </button>
        `;
        TASKS_LIST.appendChild(TASK_ITEM);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const INDEX = parseInt(this.dataset.index);
            CURRENT_TASKS.splice(INDEX, 1);
            renderTasks();
        });
    });
}

// Add a task to the edit form
function addEditTask() {
    const TASK_TEXT = EDIT_TASK_INPUT.value.trim();
    
    if (TASK_TEXT) {
        EDIT_TASKS.push(TASK_TEXT);
        renderEditTasks();
        EDIT_TASK_INPUT.value = '';
        EDIT_TASK_INPUT.focus();
    }
}

// Render tasks in the edit form
function renderEditTasks() {
    EDIT_TASKS_LIST.innerHTML = '';
    
    EDIT_TASKS.forEach((task, index) => {
        const TASK_ITEM = document.createElement('div');
        TASK_ITEM.className = 'task-item';
        TASK_ITEM.innerHTML = `
            <span>${task}</span>
            <button type="button" class="remove-task-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"/></svg>
            </button>
        `;
        EDIT_TASKS_LIST.appendChild(TASK_ITEM);
    });
    
    // Add event listeners to remove buttons
    EDIT_TASKS_LIST.querySelectorAll('.remove-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const INDEX = parseInt(this.dataset.index);
            EDIT_TASKS.splice(INDEX, 1);
            renderEditTasks();
        });
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const EVENT_NAME = EVENT_NAME_INPUT.value;
    const DESCRIPTION = EVENT_DESCRIPTION_INPUT.value;
    const DATE_TIME = new Date(DATE_TIME_INPUT.value).getTime();
    
    // Get selected background
    let SELECTED_BACKGROUND = 'theme-1';
    BACKGROUND_INPUTS.forEach(input => {
        if (input.checked) {
            SELECTED_BACKGROUND = input.value;
        }
    });
    
    // Validate date is in the future
    if (DATE_TIME <= Date.now()) {
        alert('Please select a future date and time');
        return;
    }
    
    // Create countdown object
    const COUNTDOWN = {
        id: null, // Will be set in saveCountdown
        eventName: EVENT_NAME,
        description: DESCRIPTION,
        tasks: [...CURRENT_TASKS],
        targetDate: DATE_TIME,
        background: SELECTED_BACKGROUND,
        createdAt: Date.now()
    };
    
    // Save countdown
    const COUNTDOWN_ID = saveCountdown(COUNTDOWN);
    
    // Reset form and tasks
    COUNTDOWN_FORM.reset();
    CURRENT_TASKS = [];
    renderTasks();
    updateMinDateTime();
    
    // View the created countdown
    viewCountdown(COUNTDOWN_ID);
}

// Handle edit form submission
function handleEditFormSubmit(e) {
    e.preventDefault();
    
    const EVENT_NAME = EDIT_EVENT_NAME.value;
    const DESCRIPTION = EDIT_EVENT_DESCRIPTION.value;
    const DATE_TIME = new Date(EDIT_DATE_TIME.value).getTime();
    
    // Get selected background
    let SELECTED_BACKGROUND = 'theme-1';
    EDIT_BACKGROUND_INPUTS.forEach(input => {
        if (input.checked) {
            SELECTED_BACKGROUND = input.value;
        }
    });
    
    // Validate date is in the future
    if (DATE_TIME <= Date.now()) {
        alert('Please select a future date and time');
        return;
    }
    
    // Find the countdown to update
    const COUNTDOWN_INDEX = ALL_COUNTDOWNS.findIndex(c => c.id === ACTIVE_COUNTDOWN_ID);
    
    if (COUNTDOWN_INDEX !== -1) {
        // Update countdown
        ALL_COUNTDOWNS[COUNTDOWN_INDEX] = {
            ...ALL_COUNTDOWNS[COUNTDOWN_INDEX],
            eventName: EVENT_NAME,
            description: DESCRIPTION,
            tasks: [...EDIT_TASKS],
            targetDate: DATE_TIME,
            background: SELECTED_BACKGROUND,
            updatedAt: Date.now()
        };
        
        // Save to localStorage
        localStorage.setItem('bimbaCountdowns', JSON.stringify(ALL_COUNTDOWNS));
        
        // Close modal
        closeEditModal();
        
        // Update view
        updateCountdownView();
    }
}

// Open edit modal
function openEditModal() {
    // Find the active countdown
    const COUNTDOWN = ALL_COUNTDOWNS.find(c => c.id === ACTIVE_COUNTDOWN_ID);
    
    if (COUNTDOWN) {
        // Fill the form with countdown data
        EDIT_EVENT_NAME.value = COUNTDOWN.eventName;
        EDIT_EVENT_DESCRIPTION.value = COUNTDOWN.description || '';
        
        // Format date for datetime-local input
        const TARGET_DATE = new Date(COUNTDOWN.targetDate);
        const YEAR = TARGET_DATE.getFullYear();
        const MONTH = String(TARGET_DATE.getMonth() + 1).padStart(2, '0');
        const DAY = String(TARGET_DATE.getDate()).padStart(2, '0');
        const HOURS = String(TARGET_DATE.getHours()).padStart(2, '0');
        const MINUTES = String(TARGET_DATE.getMinutes()).padStart(2, '0');
        
        EDIT_DATE_TIME.value = `${YEAR}-${MONTH}-${DAY}T${HOURS}:${MINUTES}`;
        
        // Set background
        EDIT_BACKGROUND_INPUTS.forEach(input => {
            if (input.value === COUNTDOWN.background) {
                input.checked = true;
            }
        });
        
        // Set tasks
        EDIT_TASKS = [...(COUNTDOWN.tasks || [])];
        renderEditTasks();
        
        // Show modal
        EDIT_MODAL.classList.add('active');
    }
}

// Close edit modal
function closeEditModal() {
    EDIT_MODAL.classList.remove('active');
}

// Save countdown to localStorage
function saveCountdown(countdown) {
    // Generate a unique ID
    countdown.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    // Add to array
    ALL_COUNTDOWNS.push(countdown);
    
    // Save to localStorage
    localStorage.setItem('bimbaCountdowns', JSON.stringify(ALL_COUNTDOWNS));
    
    return countdown.id;
}

// Load countdowns from localStorage
function loadCountdowns() {
    const SAVED_COUNTDOWNS = localStorage.getItem('bimbaCountdowns');
    
    if (SAVED_COUNTDOWNS) {
        ALL_COUNTDOWNS = JSON.parse(SAVED_COUNTDOWNS);
        renderCountdownsList();
    }
}

// Render countdowns list
function renderCountdownsList() {
    // Clear list
    COUNTDOWNS_LIST.innerHTML = '';
    
    if (ALL_COUNTDOWNS.length === 0) {
        // Show empty state
        COUNTDOWNS_LIST.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 4h10v2H11V4zm0 4h6v2h-6V8zm0 6h10v2H11v-2zm0 4h6v2h-6v-2zM3 4h6v6H3V4zm2 2v2h2V6H5zm-2 8h6v6H3v-6zm2 2v2h2v-2H5z" fill="currentColor"/></svg>
                <p>No countdowns yet</p>
                <button id="create-first-btn" class="action-btn">Create Your First Countdown</button>
            </div>
        `;
        
        // Add event listener to the new button
        const CREATE_FIRST_BTN = document.getElementById('create-first-btn');
        if (CREATE_FIRST_BTN) {
            CREATE_FIRST_BTN.addEventListener('click', showCreateScreen);
        }
        
        return;
    }
    
    // Sort countdowns by date (closest first)
    const SORTED_COUNTDOWNS = [...ALL_COUNTDOWNS].sort((a, b) => a.targetDate - b.targetDate);
    
    // Render each countdown
    SORTED_COUNTDOWNS.forEach(countdown => {
        const TIME_LEFT = countdown.targetDate - Date.now();
        const IS_EXPIRED = TIME_LEFT <= 0;
        
        // Calculate time units
        const DAYS = Math.max(0, Math.floor(TIME_LEFT / (1000 * 60 * 60 * 24)));
        const HOURS = Math.max(0, Math.floor((TIME_LEFT % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const MINUTES = Math.max(0, Math.floor((TIME_LEFT % (1000 * 60 * 60)) / (1000 * 60)));
        
        const CARD = document.createElement('div');
        CARD.className = 'countdown-card';
        CARD.dataset.id = countdown.id;
        
        // Check if there's a description
        const HAS_DESCRIPTION = countdown.description && countdown.description.trim().length > 0;
        
        // Check if there are tasks
        const HAS_TASKS = countdown.tasks && countdown.tasks.length > 0;
        
        CARD.innerHTML = `
            <div class="card-header ${countdown.background}">
                <h3>${countdown.eventName}</h3>
            </div>
            <div class="card-body">
                <div class="card-time">
                    <div class="card-time-item">
                        <div class="card-time-value">${String(DAYS).padStart(2, '0')}</div>
                        <div class="card-time-label">Days</div>
                    </div>
                    <div class="card-time-item">
                        <div class="card-time-value">${String(HOURS).padStart(2, '0')}</div>
                        <div class="card-time-label">Hours</div>
                    </div>
                    <div class="card-time-item">
                        <div class="card-time-value">${String(MINUTES).padStart(2, '0')}</div>
                        <div class="card-time-label">Mins</div>
                    </div>
                </div>
                ${HAS_DESCRIPTION ? `<div class="card-description">${countdown.description}</div>` : ''}
                ${HAS_TASKS ? `
                    <div class="card-tasks">
                        <div class="card-tasks-count">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 4h10v2H11V4zm0 4h6v2h-6V8zm0 6h10v2H11v-2zm0 4h6v2h-6v-2zM3 4h6v6H3V4zm2 2v2h2V6H5zm-2 8h6v6H3v-6zm2 2v2h2v-2H5z" fill="currentColor"/></svg>
                            ${countdown.tasks.length} task${countdown.tasks.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add event listener to view countdown
        CARD.addEventListener('click', () => {
            viewCountdown(countdown.id);
        });
        
        COUNTDOWNS_LIST.appendChild(CARD);
    });
}

// View countdown
function viewCountdown(countdownId) {
    // Find countdown
    const COUNTDOWN = ALL_COUNTDOWNS.find(c => c.id === countdownId);
    
    if (!COUNTDOWN) return;
    
    // Set active countdown
    ACTIVE_COUNTDOWN_ID = countdownId;
    
    // Update view
    updateCountdownView();
    
    // Show countdown view screen
    showScreen(COUNTDOWN_VIEW_SCREEN);
    
    // Start countdown
    startCountdown();
}

// Update countdown view
function updateCountdownView() {
    // Find countdown
    const COUNTDOWN = ALL_COUNTDOWNS.find(c => c.id === ACTIVE_COUNTDOWN_ID);
    
    if (!COUNTDOWN) return;
    
    // Update event name
    DISPLAY_EVENT_NAME.textContent = COUNTDOWN.eventName;
    
    // Update description
    if (COUNTDOWN.description && COUNTDOWN.description.trim().length > 0) {
        DISPLAY_DESCRIPTION.textContent = COUNTDOWN.description;
        DISPLAY_DESCRIPTION.style.display = 'block';
    } else {
        DISPLAY_DESCRIPTION.style.display = 'none';
    }
    
    // Update tasks
    if (COUNTDOWN.tasks && COUNTDOWN.tasks.length > 0) {
        DISPLAY_TASKS.innerHTML = '';
        COUNTDOWN.tasks.forEach(task => {
            const LI = document.createElement('li');
            LI.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" fill="currentColor"/></svg>
                ${task}
            `;
            DISPLAY_TASKS.appendChild(LI);
        });
        TASKS_DISPLAY.style.display = 'block';
    } else {
        TASKS_DISPLAY.style.display = 'none';
    }
    
    // Update background
    COUNTDOWN_VIEW_SCREEN.className = `screen active-screen ${COUNTDOWN.background}`;
}

// Start countdown
function startCountdown() {
    // Clear any existing interval
    if (COUNTDOWN_INTERVAL) {
        clearInterval(COUNTDOWN_INTERVAL);
    }
    
    // Update countdown immediately
    updateCountdown();
    
    // Set interval to update countdown every second
    COUNTDOWN_INTERVAL = setInterval(updateCountdown, 1000);
}

// Update countdown
function updateCountdown() {
    // Find countdown
    const COUNTDOWN = ALL_COUNTDOWNS.find(c => c.id === ACTIVE_COUNTDOWN_ID);
    
    if (!COUNTDOWN) return;
    
    // Calculate time difference
    const NOW = Date.now();
    const TIME_DIFF = COUNTDOWN.targetDate - NOW;
    
    // Check if countdown is over
    if (TIME_DIFF <= 0) {
        clearInterval(COUNTDOWN_INTERVAL);
        DAYS_ELEMENT.textContent = '00';
        HOURS_ELEMENT.textContent = '00';
        MINUTES_ELEMENT.textContent = '00';
        SECONDS_ELEMENT.textContent = '00';
        return;
    }
    
    // Calculate time units
    const DAYS = Math.floor(TIME_DIFF / (1000 * 60 * 60 * 24));
    const HOURS = Math.floor((TIME_DIFF % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const MINUTES = Math.floor((TIME_DIFF % (1000 * 60 * 60)) / (1000 * 60));
    const SECONDS = Math.floor((TIME_DIFF % (1000 * 60)) / 1000);
    
    // Update DOM with animation if value changed
    updateTimeElement(DAYS_ELEMENT, DAYS);
    updateTimeElement(HOURS_ELEMENT, HOURS);
    updateTimeElement(MINUTES_ELEMENT, MINUTES);
    updateTimeElement(SECONDS_ELEMENT, SECONDS);
}

// Update time element with animation
function updateTimeElement(element, value) {
    const FORMATTED_VALUE = String(value).padStart(2, '0');
    
    if (element.textContent !== FORMATTED_VALUE) {
        element.classList.add('animate');
        element.textContent = FORMATTED_VALUE;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('animate');
        }, 500);
    }
}

// Handle delete countdown
function handleDeleteCountdown() {
    if (confirm('Are you sure you want to delete this countdown?')) {
        // Remove countdown from array
        ALL_COUNTDOWNS = ALL_COUNTDOWNS.filter(c => c.id !== ACTIVE_COUNTDOWN_ID);
        
        // Save to localStorage
        localStorage.setItem('bimbaCountdowns', JSON.stringify(ALL_COUNTDOWNS));
        
        // Clear active countdown
        ACTIVE_COUNTDOWN_ID = null;
        
        // Stop countdown
        if (COUNTDOWN_INTERVAL) {
            clearInterval(COUNTDOWN_INTERVAL);
            COUNTDOWN_INTERVAL = null;
        }
        
        // Show countdowns screen
        showCountdownsScreen();
    }
}

// Handle share countdown
function handleShareCountdown() {
    // Find countdown
    const COUNTDOWN = ALL_COUNTDOWNS.find(c => c.id === ACTIVE_COUNTDOWN_ID);
    
    if (!COUNTDOWN) return;
    
    // Format date for sharing
    const TARGET_DATE = new Date(COUNTDOWN.targetDate);
    const FORMATTED_DATE = TARGET_DATE.toLocaleDateString();
    const FORMATTED_TIME = TARGET_DATE.toLocaleTimeString();
    
    // Create share text
    const SHARE_TEXT = `Countdown to ${COUNTDOWN.eventName} on ${FORMATTED_DATE} at ${FORMATTED_TIME}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'Bimba Countdown',
            text: SHARE_TEXT
        })
        .catch(error => {
            fallbackShare(SHARE_TEXT);
        });
    } else {
        fallbackShare(SHARE_TEXT);
    }
}

// Fallback share method
function fallbackShare(text) {
    // Create a temporary input element
    const INPUT = document.createElement('input');
    INPUT.value = text;
    document.body.appendChild(INPUT);
    
    // Select and copy the text
    INPUT.select();
    document.execCommand('copy');
    
    // Remove the input element
    document.body.removeChild(INPUT);
    
    // Notify user
    alert('Countdown details copied to clipboard!');
}

// Show create screen
function showCreateScreen() {
    showScreen(CREATE_SCREEN);
    HOME_BTN.classList.add('active');
    COUNTDOWNS_BTN.classList.remove('active');
    
    // Reset current tasks
    CURRENT_TASKS = [];
    renderTasks();
    
    // Update min date-time
    updateMinDateTime();
}

// Show countdowns screen
function showCountdownsScreen() {
    // Render countdowns list
    renderCountdownsList();
    
    showScreen(COUNTDOWNS_SCREEN);
    HOME_BTN.classList.remove('active');
    COUNTDOWNS_BTN.classList.add('active');
    
    // Stop countdown if running
    if (COUNTDOWN_INTERVAL) {
        clearInterval(COUNTDOWN_INTERVAL);
        COUNTDOWN_INTERVAL = null;
    }
}

// Show world clock screen
function showWorldClockScreen() {
    showScreen(WORLD_CLOCK_SCREEN);
    HOME_BTN.classList.remove('active');
    COUNTDOWNS_BTN.classList.remove('active');
    WORLD_CLOCK_BTN.classList.add('active');
    
    // Update current clock
    updateCurrentTimezone();
}

// Show screen
function showScreen(screen) {
    // Hide all screens
    CREATE_SCREEN.classList.remove('active-screen');
    COUNTDOWNS_SCREEN.classList.remove('active-screen');
    COUNTDOWN_VIEW_SCREEN.classList.remove('active-screen');
    WORLD_CLOCK_SCREEN.classList.remove('active-screen');
    
    // Show selected screen
    screen.classList.add('active-screen');
}

// Toggle theme
function toggleTheme() {
    const HTML = document.documentElement;
    const CURRENT_THEME = HTML.getAttribute('data-theme') || 'dark';
    const NEW_THEME = CURRENT_THEME === 'dark' ? 'light' : 'dark';
    
    // Update HTML attribute
    HTML.setAttribute('data-theme', NEW_THEME);
    
    // Save theme preference
    localStorage.setItem('theme', NEW_THEME);
    
    // Update icon visibility
    if (NEW_THEME === 'dark') {
        MOON_ICON.style.display = 'block';
        SUN_ICON.style.display = 'none';
    } else {
        MOON_ICON.style.display = 'none';
        SUN_ICON.style.display = 'block';
    }
}

// Apply theme from localStorage
function applyTheme() {
    const HTML = document.documentElement;
    const SAVED_THEME = localStorage.getItem('theme') || 'dark'; // Default to dark
    
    // Apply theme
    HTML.setAttribute('data-theme', SAVED_THEME);
    
    // Update icon visibility
    if (SAVED_THEME === 'dark') {
        MOON_ICON.style.display = 'block';
        SUN_ICON.style.display = 'none';
    } else {
        MOON_ICON.style.display = 'none';
        SUN_ICON.style.display = 'block';
    }
}

// Start world clock
function startWorldClock() {
    // Load saved timezones
    loadSavedTimezones();
    
    // Start clock interval
    if (CLOCK_INTERVAL) {
        clearInterval(CLOCK_INTERVAL);
    }
    
    CLOCK_INTERVAL = setInterval(() => {
        updateAllClocks();
    }, 1000);
    
    // Initial update
    updateAllClocks();
}

// Update all clocks
function updateAllClocks() {
    // Update main clock
    updateCurrentTimezone();
    
    // Update saved timezone clocks
    updateSavedTimezones();
}

// Update current timezone clock
function updateCurrentTimezone() {
    const SELECTED_TIMEZONE = TIMEZONE_SELECT.value;
    let currentTime;
    
    if (SELECTED_TIMEZONE === 'local') {
        currentTime = new Date();
        CURRENT_TIMEZONE.textContent = 'Local Time';
    } else {
        currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: SELECTED_TIMEZONE }));
        CURRENT_TIMEZONE.textContent = formatTimezoneName(SELECTED_TIMEZONE);
    }
    
    // Update digital clock
    CURRENT_TIME.textContent = formatTime(currentTime);
    CURRENT_DATE.textContent = formatDate(currentTime);
    
    // Update analog clock
    updateAnalogClock(currentTime);
}

// Update analog clock
function updateAnalogClock(time) {
    const HOURS = time.getHours() % 12;
    const MINUTES = time.getMinutes();
    const SECONDS = time.getSeconds();
    
    const HOUR_DEG = (HOURS * 30) + (MINUTES * 0.5);
    const MINUTE_DEG = MINUTES * 6;
    const SECOND_DEG = SECONDS * 6;
    
    CLOCK_HOUR.style.transform = `translate(-50%, -100%) rotate(${HOUR_DEG}deg)`;
    CLOCK_MINUTE.style.transform = `translate(-50%, -100%) rotate(${MINUTE_DEG}deg)`;
    CLOCK_SECOND.style.transform = `translate(-50%, -100%) rotate(${SECOND_DEG}deg)`;
}

// Format time as HH:MM:SS
function formatTime(date) {
    const HOURS = String(date.getHours()).padStart(2, '0');
    const MINUTES = String(date.getMinutes()).padStart(2, '0');
    const SECONDS = String(date.getSeconds()).padStart(2, '0');
    
    return `${HOURS}:${MINUTES}:${SECONDS}`;
}

// Format date as Day, Month Date, Year
function formatDate(date) {
    const OPTIONS = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', OPTIONS);
}

// Format timezone name
function formatTimezoneName(timezone) {
    if (timezone === 'UTC') return 'Coordinated Universal Time (UTC)';
    
    // Remove continent and split by underscore or slash
    const PARTS = timezone.split(/[/_]/);
    const CITY = PARTS[PARTS.length - 1].replace(/_/g, ' ');
    
    return CITY;
}

// Add timezone
function addTimezone() {
    const SELECTED_TIMEZONE = TIMEZONE_SELECT.value;
    
    // Don't add duplicates
    if (SAVED_TIMEZONES.includes(SELECTED_TIMEZONE)) {
        alert('This timezone is already added');
        return;
    }
    
    // Add to saved timezones
    SAVED_TIMEZONES.push(SELECTED_TIMEZONE);
    saveTimezones();
    
    // Render timezone clocks
    renderTimezoneClocks();
}

// Remove timezone
function removeTimezone(timezone) {
    const INDEX = SAVED_TIMEZONES.indexOf(timezone);
    if (INDEX !== -1) {
        SAVED_TIMEZONES.splice(INDEX, 1);
        saveTimezones();
        renderTimezoneClocks();
    }
}

// Save timezones to localStorage
function saveTimezones() {
    localStorage.setItem('savedTimezones', JSON.stringify(SAVED_TIMEZONES));
}

// Load saved timezones from localStorage
function loadSavedTimezones() {
    const SAVED = localStorage.getItem('savedTimezones');
    SAVED_TIMEZONES = SAVED ? JSON.parse(SAVED) : [];
    renderTimezoneClocks();
}

// Render timezone clocks
function renderTimezoneClocks() {
    TIMEZONE_CLOCKS.innerHTML = '';
    
    if (SAVED_TIMEZONES.length === 0) {
        TIMEZONE_CLOCKS.innerHTML = `
            <div class="empty-state">
                <p>No timezones added yet</p>
                <p>Select a timezone from the dropdown and click "Add"</p>
            </div>
        `;
        return;
    }
    
    SAVED_TIMEZONES.forEach(timezone => {
        createTimezoneClock(timezone);
    });
}

// Create timezone clock
function createTimezoneClock(timezone) {
    const CLOCK = document.createElement('div');
    CLOCK.className = 'timezone-clock';
    CLOCK.dataset.timezone = timezone;
    
    CLOCK.innerHTML = `
        <div class="timezone-clock-header">
            <div class="timezone-name">${formatTimezoneName(timezone)}</div>
            <button type="button" class="remove-timezone-btn" data-timezone="${timezone}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"/></svg>
            </button>
        </div>
        <div class="timezone-time">00:00:00</div>
        <div class="timezone-date">Monday, January 1, 2023</div>
        <div class="timezone-diff"></div>
    `;
    
    TIMEZONE_CLOCKS.appendChild(CLOCK);
    
    // Add event listener to remove button
    CLOCK.querySelector('.remove-timezone-btn').addEventListener('click', function() {
        removeTimezone(timezone);
    });
    
    // Update the clock
    updateTimezoneClock(timezone);
}

// Update saved timezone clocks
function updateSavedTimezones() {
    SAVED_TIMEZONES.forEach(timezone => {
        updateTimezoneClock(timezone);
    });
}

// Update timezone clock
function updateTimezoneClock(timezone) {
    const CLOCK = document.querySelector(`.timezone-clock[data-timezone="${timezone}"]`);
    if (!CLOCK) return;
    
    let timezoneTime;
    
    if (timezone === 'local') {
        timezoneTime = new Date();
    } else {
        timezoneTime = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
    }
    
    // Update time and date
    CLOCK.querySelector('.timezone-time').textContent = formatTime(timezoneTime);
    CLOCK.querySelector('.timezone-date').textContent = formatDate(timezoneTime);
    
    // Calculate and display time difference
    const LOCAL_TIME = new Date();
    const DIFF_HOURS = calculateTimeDifference(LOCAL_TIME, timezoneTime);
    const DIFF_TEXT = DIFF_HOURS === 0 ? 'Same as local time' : 
                     (DIFF_HOURS > 0 ? `+${DIFF_HOURS}h` : `${DIFF_HOURS}h`);
    
    CLOCK.querySelector('.timezone-diff').textContent = DIFF_TEXT;
}

// Calculate time difference in hours
function calculateTimeDifference(localTime, timezoneTime) {
    const LOCAL_HOURS = localTime.getHours() + (localTime.getMinutes() / 60);
    const TIMEZONE_HOURS = timezoneTime.getHours() + (timezoneTime.getMinutes() / 60);
    
    // Handle day boundary cases
    let diff = TIMEZONE_HOURS - LOCAL_HOURS;
    
    if (diff > 12) {
        diff -= 24;
    } else if (diff < -12) {
        diff += 24;
    }
    
    return Math.round(diff);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
