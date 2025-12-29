// Track selected mood
let selectedMood = null;

// Show mood modal on page load
window.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('moodModal');
    // Modal is visible by default
    if (modal) {
        modal.classList.remove('hidden');
    }
    
    // Add click event listeners to mood options
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', function() {
            const moodValue = this.getAttribute('data-mood');
            selectMood(this, moodValue);
        });
    });
    
    // Add click event to close button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMoodModal);
    }
    
    // Add click event to confirm button
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', submitMood);
    }
});

// Select mood function
function selectMood(element, moodValue) {
    console.log('Mood selected:', moodValue);
    
    // Remove selection from all options
    document.querySelectorAll('.mood-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    element.classList.add('selected');
    selectedMood = moodValue;
    
    // Enable confirm button
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
    }
}

// Submit mood
function submitMood() {
    console.log('Submit clicked, selectedMood:', selectedMood);
    
    if (!selectedMood) {
        alert('Please select your mood before confirming.');
        return;
    }
    
    // Log the selected mood 
    console.log('Mood submitted:', selectedMood);
    
    // Close modal after submission
    closeMoodModal();
}

// Close mood modal
function closeMoodModal() {
    console.log('Closing modal');
    
    const modal = document.getElementById('moodModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Reset selection for next time
    document.querySelectorAll('.mood-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedMood = null;
    
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }
}


window.selectMood = selectMood;
window.submitMood = submitMood;
window.closeMoodModal = closeMoodModal;