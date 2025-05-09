//Maya Conway
//script.js
//TSP Comparison
//5-8-25

fetch('results.json')
  .then(response => response.json())
  .then(data => {
    const timeCtx = document.getElementById('tspChart').getContext('2d');
    const distCtx = document.getElementById('distanceChart').getContext('2d');

    //I don't know why I converted the time to secs but here's me converting it back to ms
    //Also converting time to floats
    const hkTimes = data.hkTimes.map(t => t !== null ? parseFloat(t) * 1000 : null);
    const lsTimes = data.lsTimes.map(t => parseFloat(t) * 1000);
    const hkDists = data.hkDists;
    const lsDists = data.lsDists;

    new Chart(timeCtx, {
      type: 'line',
      data: {
        labels: data.inputSizes,
        datasets: [
          {
            label: 'Held-Karp',
            data: hkTimes,
            borderColor: 'rgb(47, 50, 247)',
          },
          {
            label: 'Local Search',
            data: lsTimes,
            borderColor: 'rgb(52, 235, 146)',
          }
        ]
      },
      options: {
        responsive: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Number of Cities'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Time (ms)'
            },
            type: 'logarithmic',
            beginAtZero: true,
            max: 4100000
          }
        }
      }
    });

    new Chart(distCtx, {
      type: 'line',
      data: {
        labels: data.inputSizes,
        datasets: [
          {
            label: 'Held-Karp Distance',
            data: hkDists,
            borderColor: 'rgb(47, 50, 247)',
          },
          {
            label: 'Local Search Distance',
            data: lsDists,
            borderColor: 'rgb(52, 235, 146)',
          }
        ]
      },
      options: {
        responsive: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Number of Cities'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Total Distance'
            },
            max: 100
          }
        }
      }
    });
  });
