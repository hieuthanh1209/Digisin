document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');
    let currentRole = 'waiter';

    // Handle tab switching
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            // Remove active class from all triggers and contents
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked trigger and corresponding content
            trigger.classList.add('active');
            currentRole = trigger.dataset.role;
            document.getElementById(`${currentRole}Content`).classList.add('active');
        });
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!username || !password) {
            alert('Vui lòng nhập đầy đủ thông tin đăng nhập');
            return;
        }

        // In a real application, you would validate credentials against a backend
        // For demo purposes, we'll use some basic checks
        if (username === currentRole && password === 'password') {
            // Redirect to appropriate dashboard based on role
            window.location.href = `./dashboard/${currentRole}-dashboard.html`;
        } else {
            alert('Thông tin đăng nhập không chính xác');
        }
    });
}); 