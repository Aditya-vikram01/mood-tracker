const localStorageData = JSON.parse(localStorage.getItem('moodValue')) || [];
const mood = document.getElementById('mood-select');
const chartCanvas = document.getElementById('mood-chart');
const timeframeSelect = document.getElementById('timeframe-select');

window.onload = () => {
  mood.value = '';
  updateChart();
};

const reset = ()=>{
  setTimeout(() => {
  mood.selectedIndex = 0;
}, 1 * 1000)};

mood.addEventListener('change', () => {
  if (mood.value !== '') {
    localStorageData.push({
      moodValue: getValue(mood.value),
      date: new Date().toISOString(),
    });
    localStorage.setItem('moodValue', JSON.stringify(localStorageData));
    reset();
    updateChart();

  }
});

timeframeSelect.addEventListener('change', () => {
  updateChart();
});

let myChart;
function updateChart() {
  if (myChart) {
    myChart.destroy();
  }

  const filteredData = getFilteredData(timeframeSelect.value);

  myChart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Happy', 'Sad', 'Neutral', 'Excited'],
      datasets: [
        {
          label: 'Mood Tracker',
          data: getMoodCounts(filteredData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

function getValue(mood) {
  switch (mood) {
    case 'happy':
      return 5;
    case 'sad':
      return 1;
    case 'neutral':
      return 3;
    case 'excited':
      return 4;
    default:
      return 3;
  }
}

function getMoodCounts(filteredData) {
  const moodCounts = [0, 0, 0, 0];
  filteredData.forEach((entry) => {
    switch (entry.moodValue) {
      case 5:
        moodCounts[0]++;
        break;
      case 1:
        moodCounts[1]++;
        break;
      case 3:
        moodCounts[2]++;
        break;
      case 4:
        moodCounts[3]++;
        break;
    }
  });
  return moodCounts;
}

function getFilteredData(timeframe) {
  const now = new Date();
  return localStorageData.filter((entry) => {
    const entryDate = new Date(entry.date);
    switch (timeframe) {
      case 'day':
        return isSameDay(now, entryDate);
      case 'week':
        return isSameWeek(now, entryDate);
      case 'month':
        return isSameMonth(now, entryDate);
      case 'year':
        return isSameYear(now, entryDate);
      default:
        return true;
    }
  });
}

function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isSameWeek(date1, date2) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const dayOfWeek = date1.getDay(); // Get current day of the week
  const startOfWeek = new Date(date1 - dayOfWeek * oneDayMs);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * oneDayMs);
  return date2 >= startOfWeek && date2 <= endOfWeek;
}

function isSameMonth(date1, date2) {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isSameYear(date1, date2) {
  return date1.getFullYear() === date2.getFullYear();
}
