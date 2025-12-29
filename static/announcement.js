document.addEventListener('DOMContentLoaded', function() {
    
    // Add click event to announcement items
    const announcementItems = document.querySelectorAll('.announcement-item');
    
    // Add hover effect
    announcementItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e8e8e8';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
    });
});