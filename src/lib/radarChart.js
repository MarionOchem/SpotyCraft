// Had to create this additional graph constructor because its architecture differs specifically from the more generic one used in renderChart.js

import Chart from "chart.js/auto";

export const radarChart = async (labels, currentData, monthlyData, ctx) => {
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Current listening",
          data: currentData,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
        },
        {
          label: "Past 6 months listening",
          data: monthlyData,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  });
};

// export const radarChart = async (labels, currentData, monthlyData, ctx) => {
//   new Chart(ctx, {
//     type: "radar",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: "Current listening",
//           data: currentData,
//           fill: true,
//           borderColor: Utils.CHART_COLORS.red,
//           backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//         },
//         {
//           label: "Past 6 months listening",
//           data: monthlyData,
//           fill: true,
//           borderColor: Utils.CHART_COLORS.blue,
//           backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//         },
//       ],
//     },
//     options: {
//       elements: {
//         line: {
//           borderWidth: 3,
//         },
//       },
//     },
//   });
// };
