function getFormattedDate() {
    const now = new Date();
    return now.toDateString(); // e.g., "Fri May 09 2025"
  }
  
  document.getElementById('date').textContent = getFormattedDate();
  