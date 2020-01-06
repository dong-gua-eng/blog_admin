export const echartData = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  legend: {
    data: ['warning', 'restore'],
    bottom: 4
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '6%',
    bottom: '14%',
    width: '97%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ['24:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00']
  }],
  yAxis: [{
    type: 'value'
  }],
  series: [{
      name: 'warning',
      type: 'bar',
      stack: 'data',
      data: [120, 132, 102, 134, 90, 230, 210, 110, 120, 140, 220, 220],
      itemStyle: {
        color: '#61a0a8'
      },
      barWidth: 20
    },
    {
      name: 'restore',
      type: 'bar',
      stack: 'data',
      data: [220, 182, 191, 234, 290, 330, 310, 120, 330, 230, 210, 110],
      itemStyle: {
        color: '#91c7ae'
      },
      barWidth: 20
    }
  ]
}