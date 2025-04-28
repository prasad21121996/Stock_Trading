document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('data.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const investments = results.data;
      const tbody = document.getElementById('investmentTable').querySelector('tbody');

      // Group by Date
      const dateGroups = {};

      investments.forEach(investment => {
        if (!investment.name || !investment.date) return;

        const date = investment.date;
        const amount = parseFloat(investment.amount);
        const conversionRate = parseFloat(investment.conversionRate);
        const amountInUSD = amount * conversionRate;

        if (!dateGroups[date]) {
          dateGroups[date] = [];
        }
        dateGroups[date].push({
          ...investment,
          amountInUSD
        });
      });

      // Latest date data for table
      const sortedDates = Object.keys(dateGroups).sort();
      const latestDate = sortedDates[sortedDates.length - 1];
      const latestInvestments = dateGroups[latestDate];

      let totalUSD = 0;
      latestInvestments.forEach(investment => {
        totalUSD += investment.amountInUSD;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${investment.name}</td>
          <td>${investment.amount}</td>
          <td>${investment.currency}</td>
          <td>$${investment.amountInUSD.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });

      document.getElementById('totalNetWorth').innerText = `Total Net Worth on ${latestDate}: $${totalUSD.toFixed(2)} USD`;

      // Prepare Net Worth Over Time Data
      const labels = [];
      const totalNetWorthOverTime = [];

      sortedDates.forEach(date => {
        const dayInvestments = dateGroups[date];
        const dayTotal = dayInvestments.reduce((sum, inv) => sum + inv.amountInUSD, 0);
        labels.push(date);
        totalNetWorthOverTime.push(dayTotal.toFixed(2));
      });

      // Line Chart
      const ctx = document.getElementById('netWorthChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Net Worth Over Time',
            data: totalNetWorthOverTime,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  });
});
