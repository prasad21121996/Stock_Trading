document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('data.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const investments = results.data;
      const tbody = document.getElementById('investmentTable').querySelector('tbody');
      let totalUSD = 0;
      let chartLabels = [];
      let chartData = [];

      investments.forEach(investment => {
        if (!investment.name) return; // skip empty lines

        const amount = parseFloat(investment.amount);
        const conversionRate = parseFloat(investment.conversionRate);
        const amountInUSD = amount * conversionRate;
        totalUSD += amountInUSD;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${investment.name}</td>
          <td>${amount}</td>
          <td>${investment.currency}</td>
          <td>$${amountInUSD.toFixed(2)}</td>
        `;
        tbody.appendChild(row);

        chartLabels.push(investment.name);
        chartData.push(amountInUSD.toFixed(2));
      });

      document.getElementById('totalNetWorth').innerText = `Total Net Worth: $${totalUSD.toFixed(2)} USD`;

      // Create Chart
      const ctx = document.getElementById('netWorthChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Net Worth Distribution',
            data: chartData,
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          }
        }
      });
    }
  });
});
