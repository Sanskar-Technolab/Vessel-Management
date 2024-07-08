var ctx = document.getElementById("profit-loss-chart").getContext("2d");

var mybarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2024-2025'], //current financial year
        datasets: [{
            label: 'Income',
            backgroundColor: "#F683AE",
            data: [150000]
        }, {
            label: 'Expense',
            backgroundColor: "#318AD8",
            data: [50248]
        }, {
            label: 'Net Profit/Loss',
            backgroundColor: "#48BB74",
            data: [99752]
        }]
    },

    options: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: "#343C6A",
                fontSize: 16,
                fontFamily: "Inter",
                fontWeight: '600'
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#232323",
                    fontSize: 14,
                    callback: function (value, index, values) {
                        return '$ ' + value.toLocaleString(); // Add $ sign and format number
                    }
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "#343C6A",
                    fontSize: 14
                },
                barPercentage: 0.5, // Adjust this value to control the width of the bars
                categoryPercentage: 0.5 // Adjust this value to control the space between bars
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    label += ': $' + tooltipItem.yLabel.toLocaleString();
                    return label;
                }
            }
        }
    }
});
