// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Label Modal functionality
    const addTagBtn = document.getElementById('addTagBtn');
    const labelModal = document.getElementById('labelModal');
    const closeLabelBtn = document.getElementById('closeLabelBtn');
    const addLabelBtn = document.getElementById('addLabelBtn');
    const labelInput = document.getElementById('labelInput');
    
    // Open label modal
    if (addTagBtn) {
        addTagBtn.addEventListener('click', function() {
            labelModal.classList.remove('hidden');
            labelInput.value = '';
            labelInput.focus();
        });
    }
    
    // Close label modal
    if (closeLabelBtn) {
        closeLabelBtn.addEventListener('click', closeLabelModal);
    }
    
    // Add new label
    if (addLabelBtn) {
        addLabelBtn.addEventListener('click', function() {
            const labelText = labelInput.value.trim();
            
            if (labelText === '') {
                alert('Please enter a label');
                return;
            }
            
            if (labelText.length > 10) {
                alert('Label must be 10 characters or less');
                return;
            }
            
            // Add new tag to the interest tags section
            addNewTag(labelText);
            
            // Close modal and reset input
            closeLabelModal();
        });
    }
    
    // Close modal function
    function closeLabelModal() {
        labelModal.classList.add('hidden');
        labelInput.value = '';
    }
    
    // Add new tag function
    function addNewTag(text) {
        const interestTags = document.querySelector('.interest-tags');
        const addBtn = document.getElementById('addTagBtn');
        
        // Create new tag element
        const newTag = document.createElement('span');
        newTag.className = 'tag';
        newTag.innerHTML = `${text} <button class="remove-tag">&times;</button>`;
        
        // Insert before the add button
        interestTags.insertBefore(newTag, addBtn);
        
        // Add remove functionality to the new tag
        const removeBtn = newTag.querySelector('.remove-tag');
        removeBtn.addEventListener('click', function() {
            newTag.remove();
        });
        
        console.log('New tag added:', text);
    }
    
    // Remove tag functionality for existing tags
    document.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
    
    // Edit field functionality
    const editButtons = document.querySelectorAll('.edit-btn');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const fieldName = this.getAttribute('data-field');
            let inputElement;
            
            // Get the corresponding input/textarea element
            if (fieldName === 'programme') {
                inputElement = document.getElementById('programmeInput');
            } else if (fieldName === 'location') {
                inputElement = document.getElementById('locationInput');
            } else if (fieldName === 'description') {
                inputElement = document.getElementById('descriptionInput');
            }
            
            if (inputElement) {
                // Toggle readonly and editing class
                if (inputElement.readOnly) {
                    // Enable editing
                    inputElement.readOnly = false;
                    inputElement.classList.add('editing');
                    inputElement.focus();
                    
                    // Move cursor to end
                    const len = inputElement.value.length;
                    if (inputElement.setSelectionRange) {
                        inputElement.setSelectionRange(len, len);
                    }
                    
                    console.log('Editing enabled for:', fieldName);
                } else {
                    // Save and disable editing
                    inputElement.readOnly = true;
                    inputElement.classList.remove('editing');
                    
                    console.log('Saved value for', fieldName + ':', inputElement.value);
                }
            }
        });
    });
    
    // Optional: Click outside modal to close
    labelModal.addEventListener('click', function(e) {
        if (e.target === labelModal) {
            closeLabelModal();
        }
    });
    
    // Optional: Press Enter to add label
    labelInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addLabelBtn.click();
        }
    });
    
    // Optional: Press Escape to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !labelModal.classList.contains('hidden')) {
            closeLabelModal();
        }
    });
});