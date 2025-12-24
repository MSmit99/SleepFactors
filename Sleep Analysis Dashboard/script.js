// Fetch the CSV data and process it
async function fetchData() {
    const response = await fetch('Sleep_health_and_lifestyle_dataset.csv');
    const data = await response.text();
    return csvToJson(data);
}
  
// Convert CSV to JSON format
function csvToJson(csv) {
    const lines = csv.trim().split('\n');
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        const obj = {};
        
        // Ensure data matches headers correctly, if not, skip this row
        for (let j = 0; j < headers.length; j++) {
        const value = currentLine[j]?.trim();
        obj[headers[j]] = value !== undefined ? value : null;
        }
        result.push(obj);
    }

    return result;
}
  
// Display stats and charts
async function displayData() {
    const data = await fetchData();
  
    // Calculate averages
    const avgSleep = calculateAverage(data, 'Sleep Duration');
    const avgEfficiency = calculateAverage(data, 'Quality of Sleep');
    const avgSteps = calculateAverage(data, 'Daily Steps');
    
    // Update stats
    document.getElementById('avgSleepValue').textContent = `${avgSleep} hours`;
    document.getElementById('avgEfficiencyValue').textContent = `${avgEfficiency}/10`;
    document.getElementById('avgDailySteps').textContent = `${avgSteps} steps`;

    // Initialize charts
    initCharts(data);
}
  
// Calculate average of a given field
function calculateAverage(data, field) {
    const total = data.reduce((sum, row) => {
      const value = parseFloat(row[field]);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
    
    const validCount = data.filter(row => !isNaN(parseFloat(row[field]))).length;
    return validCount > 0 ? (total / validCount).toFixed(1) : 0;
}
  
function initCharts(data) {
    console.log(data);
  
    // Sort the data by Sleep Duration for Chart 1
    const sortedData1 = data.slice().sort((a, b) => parseFloat(a['Sleep Duration']) - parseFloat(b['Sleep Duration']));
    
    // Chart 1: Sleep Duration vs Quality of Sleep
    const ctx1 = document.getElementById('sleepTrendsChart').getContext('2d');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: sortedData1.map(row => parseFloat(row['Sleep Duration'])),  // X-axis = Sleep Duration
        datasets: [
          {
            label: 'Quality of Sleep (1-10)',  // Y-axis = Sleep Quality
            data: sortedData1.map(row => parseFloat(row['Quality of Sleep'])),
            fill: false
          }
        ]
      }
    });
  
    // Sort the data by Physical Activity Level for Chart 2
    const sortedData2 = data.slice().sort((a, b) => parseFloat(a['Physical Activity Level']) - parseFloat(b['Physical Activity Level']));
  
    // Chart 2: Physical Activity Level vs Stress Level
    const ctx2 = document.getElementById('activityStressChart').getContext('2d');
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: sortedData2.map(row => parseFloat(row['Physical Activity Level'])),  // X-axis = Physical Activity Level
        datasets: [
          {
            label: 'Stress Level (1-10)',  // Y-axis = Stress Level
            data: sortedData2.map(row => parseFloat(row['Stress Level'])),
            borderColor: 'rgba(255, 159, 64, 1)',
            fill: false
          }
        ]
      }
    });
  
    // Sort the data by Heart Rate for Chart 3
    const sortedData3 = data.slice().sort((a, b) => parseFloat(a['Heart Rate']) - parseFloat(b['Heart Rate']));
  
    // Chart 3: Heart Rate vs Blood Pressure (Systolic and Diastolic)
    const ctx3 = document.getElementById('heartRateBPChart').getContext('2d');
    new Chart(ctx3, {
      type: 'line',
      data: {
        labels: sortedData3.map(row => parseFloat(row['Heart Rate'])),  // X-axis = Heart Rate
        datasets: [
          {
            label: 'Blood Pressure (Systolic)',
            data: sortedData3.map(row => {
              const bp = row['Blood Pressure'].split('/');
              const systolic = parseFloat(bp[0]);
              return !isNaN(systolic) ? systolic : null;  // Systolic BP on Y-axis
            }),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          },
          {
            label: 'Blood Pressure (Diastolic)',
            data: sortedData3.map(row => {
              const bp = row['Blood Pressure'].split('/');
              const diastolic = parseFloat(bp[1]);
              return !isNaN(diastolic) ? diastolic : null;  // Diastolic BP on Y-axis
            }),
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false
          }
        ]
      }
    });
}
  
// Show tab content
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
      tabContent.style.display = 'none';
    });
    document.getElementById(tab).style.display = 'block';
}
  
// Initialize on page load
window.onload = displayData;
  