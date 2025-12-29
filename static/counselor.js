// Calendar variables
let currentDate = new Date();
let selectedDate = null;
let availCurrentDate = new Date();

// Month names
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize calendars
    initializeCustomCalendar();
    initializeAvailabilityCalendar();
    
    // Calendar toggle
    const calendarBtn = document.getElementById('calendarBtn');
    const customCalendar = document.getElementById('customCalendar');
    const dateInput = document.getElementById('dateInput');
    
    if (calendarBtn) {
        calendarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            customCalendar.classList.toggle('hidden');
        });
    }
    
    // Close calendar when clicking outside
    document.addEventListener('click', function(e) {
        if (!customCalendar.contains(e.target) && e.target !== calendarBtn) {
            customCalendar.classList.add('hidden');
        }
    });
    
    // Navigation for custom calendar
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCustomCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCustomCalendar();
    });
    
    // Month and year select change
    document.getElementById('monthSelect').addEventListener('change', function() {
        currentDate.setMonth(parseInt(this.value));
        renderCustomCalendar();
    });
    
    document.getElementById('yearSelect').addEventListener('change', function() {
        currentDate.setFullYear(parseInt(this.value));
        renderCustomCalendar();
    });
    
    // Navigation for availability calendar
    document.getElementById('prevMonthAvail').addEventListener('click', function() {
        availCurrentDate.setMonth(availCurrentDate.getMonth() - 1);
        renderAvailabilityCalendar();
    });
    
    document.getElementById('nextMonthAvail').addEventListener('click', function() {
        availCurrentDate.setMonth(availCurrentDate.getMonth() + 1);
        renderAvailabilityCalendar();
    });
    
    // Time input validation
    const hourInput = document.getElementById('hourInput');
    const minuteInput = document.getElementById('minuteInput');
    
    hourInput.addEventListener('input', function() {
        if (this.value > 23) this.value = 23;
        if (this.value < 0) this.value = 0;
    });
    
    minuteInput.addEventListener('input', function() {
        if (this.value > 59) this.value = 59;
        if (this.value < 0) this.value = 0;
    });
});

// Initialize custom calendar
function initializeCustomCalendar() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    // Populate month select
    monthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    
    // Populate year select (current year - 10 to current year + 10)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    
    renderCustomCalendar();
}

// Render custom calendar
function renderCustomCalendar() {
    const calendarDates = document.getElementById('calendarDates');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    
    calendarDates.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Days in previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'calendar-date other-month';
        dateDiv.textContent = prevMonthDays - i;
        calendarDates.appendChild(dateDiv);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'calendar-date';
        dateDiv.textContent = day;
        
        // Check if today
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dateDiv.classList.add('today');
        }
        
        // Check if selected
        if (selectedDate && year === selectedDate.getFullYear() && 
            month === selectedDate.getMonth() && day === selectedDate.getDate()) {
            dateDiv.classList.add('selected');
        }
        
        dateDiv.addEventListener('click', function() {
            selectedDate = new Date(year, month, day);
            const dateInput = document.getElementById('dateInput');
            dateInput.value = formatDate(selectedDate);
            document.getElementById('customCalendar').classList.add('hidden');
            renderCustomCalendar();
        });
        
        calendarDates.appendChild(dateDiv);
    }
    
    // Add next month's days
    const totalCells = calendarDates.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'calendar-date other-month';
        dateDiv.textContent = day;
        calendarDates.appendChild(dateDiv);
    }
}

// Format date as dd/mm/yyyy
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Initialize availability calendar
function initializeAvailabilityCalendar() {
    renderAvailabilityCalendar();
}

// Render availability calendar
function renderAvailabilityCalendar() {
    const availabilityDates = document.getElementById('availabilityDates');
    const monthYearDisplay = document.getElementById('availMonthYear');
    
    const year = availCurrentDate.getFullYear();
    const month = availCurrentDate.getMonth();
    
    monthYearDisplay.textContent = `${monthNamesShort[month]} ${year}`;
    
    availabilityDates.innerHTML = '';
    
    // First day of month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Days in previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    // Add previous month's days (ex 9 & 13)
    for (let i = firstDay - 1; i >= 0; i--) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'avail-date other-month';
        dateDiv.textContent = prevMonthDays - i;
        availabilityDates.appendChild(dateDiv);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'avail-date';
        dateDiv.textContent = day;
        
        // Highlight specific dates 
        if (day === 9 || day === 13) {
            dateDiv.classList.add('today');
        }
        
        availabilityDates.appendChild(dateDiv);
    }
    
    // Add next month's days
    const totalCells = availabilityDates.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'avail-date other-month';
        dateDiv.textContent = day;
        availabilityDates.appendChild(dateDiv);
    }
}