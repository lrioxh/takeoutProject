// pages/analysis/analysis.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
const db = wx.cloud.database();

function initChart(canvas, width, height) {
  let dData = [];

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });

  canvas.setChart(chart);

  db.collection('student').doc(app.globalData.openid)
    .get()
    .then(res => {

      dData = res.data.dietData;
      // console.log(dData);
        var option = {
          title: {
            show: true,
            text: '月度饮食估算数据',
            subtext: '*数据按单位比例估算，不同单位数值无可比性'
          },
          legend: {
            type: 'plain',
            show: true,
            orient: 'vertical',
            right: '10%',
            top: '20%'
          },
          backgroundColor: "#ffffff",
          color: ["#37A2DA", "#FF9F7F"],
          tooltip: {
            show:true
          },
          xAxis: {
            show: false
          },
          yAxis: {
            show: false
          },
          radar: {
            // shape: 'circle',
            indicator: [{
                name: '总热量',
                max: 500
              },
              {
                name: '糖分',
                max: 500
              },
              {
                name: '脂肪',
                max: 500
              },
              {
                name: '盐分',
                max: 500
              },
              {
                name: '维生素',
                max: 500
              },
              {
                name: '膳食纤维',
                max: 500
              }
            ]
          },
          series: [{
            label: {
              normal: {
                fontSize: 24,
                rich: {}
              }
            },
            name: '月际饮食估算数据',
            type: 'radar',
            data: dData,
            
          }]
        };
      chart.setOption(option);
      return chart;
    })


}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  },
  // onLoad:function(){

  // },

  onReady() {},
  up: function() {
    db.collection('student').doc(app.globalData.openid)
      .update({
        data: {
          dietData: [{
              value: [430, 260, 120, 200, 260, 230],
              name: '上月度'
            },
            {
              value: [370, 200, 70, 110, 130, 80],
              name: '本月度'
            }
          ]
        }
      })
      .then(res=>{
        wx.redirectTo({
          url:'../analysis/analysis'
        })
      })

  }
});