document.addEventListener('DOMContentLoaded', function () {
    // Fetch the current date from the Python backend
    fetch('/.netlify/functions/get-date')
        .then(response => response.json())
        .then(data => {
            // Display the date on the page
            document.getElementById('current-date').textContent = data.date;
        })
        .catch(error => {
            console.error('Error fetching date:', error);
        });
});
