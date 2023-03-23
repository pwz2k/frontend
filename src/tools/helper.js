function BarChart(dom, data) {
  var Chart = window.Chart;
  new Chart(dom, {
    type: "bar",
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (e) {
                return e;
              },
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
    data,
  });
  return Chart;
}

function PieChart(dom, data) {
  var Chart = window.Chart;
  new Chart(dom, {
    type: "doughnut",
    options: {
      tooltips: {
        callbacks: {
          beforeLabel: function () {
            return "€";
          },
        },
      },
      legend: {
        labels: {
          generateLabels: function (chart) {},
        },
      },
    },
    data,
  });
  return Chart;
}

function LineChart(dom, data) {
  var Chart = window.Chart;
  new Chart(dom, {
    type: "line",
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (value) {
                return value + " Label";
              },
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
    data,
  });
  return Chart;
}

function Legend(data) {
  let content = "";

  data.labels.forEach(function (label, index) {
    const bgColor = data.datasets[0].backgroundColor[index];

    content += '<span class="chart-legend-item">';
    content +=
      '<i class="chart-legend-indicator" style="background-color: ' +
      bgColor +
      '"></i>';
    content += label;
    content += "</span>";
  });
  return content;
}

const quillToolbarOptions = [
  ["bold", "italic", "underline", "strike", "image", "code"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

module.exports = {
  BarChart,
  PieChart,
  LineChart,
  Legend,
  quillToolbarOptions,
};
