import UtilFunctions from "../../infrastructure/util/UtilFunctions";
import Numeral from "../../infrastructure/util/NumeralCustom";
import axios from '../../axios-setup';
import * as actionTypes from './actionTypes';

const mapIntegerMonthToAbb = (month) => {
  switch (month) {
    default:
    case 1:
      return 'Jan';
    case 2:
      return 'Feb';
    case 3:
      return 'Mar';
    case 4:
      return 'Apr';
    case 5:
      return 'May';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Aug';
    case 9:
      return 'Sep';
    case 10:
      return 'Oct';
    case 11:
      return 'Nov';
    case 12:
      return 'Dec';
  }
}

const mapMonthDayToAbb = (month, day) => {
  return `${month}-${day}`;
}

const mapInverterToAbb = (inverterNum) => {
  return `inverter_${inverterNum}`;
}

export const postBuildingData = (json) => (dispatch, getState) => {
  console.log(json)
  axios.post(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report',
    JSON.stringify(json),
    {
      headers: {
      'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    dispatch({
      type: actionTypes.SET_REPORT_ID,
      reportId: response.data.id
    });
    dispatch(request_metadata());
    dispatch(request_loss());
    dispatch(request_electricity_bill());
    dispatch(request_pv_production());
    dispatch(request_cash_flow());
    dispatch(request_board_working_condition_left());
    dispatch(request_board_working_condition_center());
    dispatch(request_board_working_condition_right());
    dispatch(request_energy());
    dispatch(request_weather());
  })
}

export const request_weather = () => (dispatch, getState) => {
  let displayMode = getState().undoable.present.reportManager.displayMode;
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name':
          displayMode.mode === 'year' || displayMode.mode === 'month' ?
          'poa_month_year' :
          'poa_day',
        date:
          displayMode.mode === 'year' ?
          'year' :
          displayMode.mode === 'month' ?
          mapIntegerMonthToAbb(displayMode.month) :
          mapMonthDayToAbb(displayMode.month, displayMode.day)
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    if (displayMode.mode === 'year') {
      let load_option = {};
      let xAxis = {};
      let yAxis = {};
      let series = [];
      let tooltip = {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
          let tooltip_bar = params[0].name + '<br/>';
          for (const param of params)
            tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' W/M<sup>2</sup> <br/>';
          return tooltip_bar;
        },
      };
      xAxis.type = 'category';
      xAxis.data = UtilFunctions.getMonthOfYearList();
      yAxis.type = 'value';
      yAxis.name = 'Irradiance (W/M²)';
      yAxis.axisLabel = {
        formatter: (value) => (Numeral(value).format('0 a'))
      };

      let current_series;

      current_series = {};
      current_series.type = 'line';
      current_series.data = response_json.data["Irradiance"];
      series.push(current_series);

      // load data
      load_option.xAxis = xAxis;
      load_option.yAxis = yAxis;
      load_option.series = series;
      load_option.tooltip = tooltip;
      load_option.title = {
        text: 'Total POA Irradiance Per Unit Area',
        x: 'center',
      };

      // dispatch success status
      dispatch({
        type: 'SUCCESS_WEATHER',
        payload: load_option,
        displayMode: displayMode
      });
    } else if (displayMode.mode === 'month') {
      let load_option = {};
      let xAxis = {};
      let yAxis = {};
      let series = [];
      let tooltip = {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
          let tooltip_bar = Numeral(params[0].name).format('0o') + ' day <br/>';
          for (const param of params)
            tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' W/M<sup>2</sup> <br/>';
          return tooltip_bar;
        },
      };
      xAxis.type = 'category';
      xAxis.name = 'Day of Month';
      xAxis.data = UtilFunctions.getDayOfMonthList(displayMode.month);
      yAxis.type = 'value';
      yAxis.name = 'Irradiance (W/M²)';
      yAxis.axisLabel = {
        formatter: (value) => (Numeral(value).format('0 a'))
      };

      let current_series;

      current_series = {};
      current_series.type = 'line';
      current_series.data = response_json.data["Irradiance"];
      series.push(current_series);

      // load data
      load_option.xAxis = xAxis;
      load_option.yAxis = yAxis;
      load_option.series = series;
      load_option.tooltip = tooltip;
      load_option.title = {
        text: 'Total POA Irradiance Per Unit Area',
        x: 'center',
      };

      // dispatch success status
      dispatch({
        type: 'SUCCESS_WEATHER',
        payload: load_option,
        displayMode: displayMode
      });
    } else if (displayMode.mode === 'day') {
      let load_option = {};
      let xAxis = {};
      let yAxis = {};
      let series = [];
      let legend = {};
      let tooltip = {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
          let tooltip_bar = Numeral(params[0].name).format('0o') + ' hour <br/>';
          for (const param of params)
            tooltip_bar += param.marker + param.seriesName + ': ' + Numeral(param.value).format('0,0') + ' W/M<sup>2</sup> <br/>';
          return tooltip_bar;
        },
      };
      xAxis.type = 'category';
      xAxis.name = 'Hour of Day';
      xAxis.data = UtilFunctions.getHourList();
      yAxis.type = 'value';
      yAxis.name = 'Irradiance (W/M²)';
      yAxis.axisLabel = {
        formatter: (value) => (Numeral(value).format('0 a'))
      };

      legend.data = [];
      legend.x = 'center';
      legend.y = 'bottom';
      let current_series;

      // Beam Irradiance
      current_series = {};
      legend.data.push('Beam Irradiance');
      current_series.name = 'Beam Irradiance';
      current_series.type = 'line';
      current_series.data = response_json.data['Beam Irradiance'];
      current_series.barGap = '10%'; //柱图间距
      series.push(current_series);

      // Sky Diffuse Irradiance
      current_series = {};
      legend.data.push('Sky Diffuse Irradiance');
      current_series.name = 'Sky Diffuse Irradiance';
      current_series.type = 'line';
      current_series.data = response_json.data['Sky Diffuse Irradiance'];
      current_series.barGap = '10%'; //柱图间距
      series.push(current_series);

      // Ground Reflected Irradiance
      current_series = {};
      legend.data.push('Ground Reflected Irradiance');
      current_series.name = 'Ground Reflected Irradiance';
      current_series.type = 'line';
      current_series.data = response_json.data['Ground Reflected Irradiance'];
      current_series.barGap = '10%'; //柱图间距
      series.push(current_series);

      // load data
      load_option.xAxis = xAxis;
      load_option.yAxis = yAxis;
      load_option.series = series;
      load_option.legend = legend;
      load_option.tooltip = tooltip;
      load_option.title = {
        text: 'POA Component Per Unit Area',
        x: 'center',
      };

      // dispatch success status
      dispatch({
        type: 'SUCCESS_WEATHER',
        payload: load_option,
        displayMode: displayMode
      });
    }
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const reload_weather = (displayMode) => (dispatch, getState) => {
  dispatch({
    type: 'RELOAD_WEATHER',
    displayMode: displayMode
  });
  dispatch(request_weather());
};

export const request_pv_production = () => (dispatch, getState) => {
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'pv_production'
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    response_json = response_json.year;
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = params[0].name + '<br/>';
        for (const param of params)
          tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' Wh<br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'category';
    xAxis.data = UtilFunctions.getMonthOfYearList();
    yAxis.type = 'value';
    yAxis.name = 'Energy';
    yAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 a') + 'Wh')
    };

    let current_series;

    current_series = {};
    current_series.type = 'bar';
    current_series.data = response_json.data["Production"];
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Monthly PV Production',
      x: 'center',
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_PV_PRODUCTION',
      payload: load_option
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const request_metadata = () => (dispatch, getState) => {
  // fetch('./mock/Get Report Meta Data.json')
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'meta_data'
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    let load_option = {data:response_json};
    // set document title
    document.title = load_option['data']['Project_Name'] + ' - Albedo';
    dispatch({
      type: 'SUCCESS_METADATA',
      payload: load_option
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const request_loss = () => (dispatch, getState) => {
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'loss'
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    response_json = response_json.year;
    // sort loss item & value
    let loss_item = response_json.data["Loss Item"];
    let loss_value = response_json.data["Loss Value"];
    for (let i = 0; i < loss_item.length; ++i) {
      for (let j = i + 1; j < loss_item.length; ++j) {
        if (loss_value[j] < loss_value[i]) {
          let temp = loss_item[i];
          loss_item[i] = loss_item[j];
          loss_item[j] = temp;

          temp = loss_value[i];
          loss_value[i] = loss_value[j];
          loss_value[j] = temp;
        }
      }
    }
    let loss_max = Math.max(...loss_value);

    //console.log(response_json);
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = params[0].name + '<br/>';
        for (const param of params)
          tooltip_bar += param.marker + Numeral(param.value).format('0.0 %') + '<br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'value';
    yAxis.type = 'category';
    yAxis.data = response_json.data["Loss Item"];
    xAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 %'))
    };

    let current_series;

    current_series = {};
    current_series.type = 'bar';
    current_series.data = response_json.data["Loss Value"];
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Energy Losses - System Loss',
      x: 'center',
    };
    load_option.grid = {
      left: '3%',
      right: '4%',
      //bottom: '3%',
      containLabel: true,
    };
    load_option.visualMap = {
      orient: 'horizontal',
      x: 'center',
      y: 'bottom',
      max: loss_max,
      min: 0,
      range: [0, loss_max],
      precision: 10000,
      text: ['High', 'Low'],
      // Map the score column to color
      dimension: 0,
      inRange: {
        color: ['#D7DA8B', '#E15457']
      },
      formatter: (value) => (Numeral(value).format('0.0 %')),
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_LOSS',
      payload: load_option
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const request_energy = () => (dispatch, getState) => {
  let displayMode = getState().undoable.present.reportManager.displayMode;
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name':
          displayMode.mode === 'year' || displayMode.mode === 'month' ?
          'dc_ac_month_year' :
          'dc_ac_day',
        date:
          displayMode.mode === 'year' ?
          'year' :
          displayMode.mode === 'month' ?
          mapIntegerMonthToAbb(displayMode.month) :
          mapMonthDayToAbb(displayMode.month, displayMode.day),
        inverter:
          mapInverterToAbb(displayMode.inverter)
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    if (displayMode.mode === 'year') {
      let load_option = {};
      let xAxis = {};
      let yAxis = {};
      let series = [];
      let tooltip = {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
          let tooltip_bar = params[0].name + '<br/>';
          for (const param of params)
            tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' Wh <br/>';
          return tooltip_bar;
        },
      };
      xAxis.type = 'category';
      xAxis.data = UtilFunctions.getMonthOfYearList();
      yAxis.type = 'value';
      yAxis.name = 'AC Energy';
      yAxis.axisLabel = {
        formatter: (value) => (Numeral(value).format('0 a') + 'Wh')
      };

      let current_series;

      current_series = {};
      current_series.type = 'line';
      current_series.data = response_json.data["AC Power"];
      series.push(current_series);

      // load data
      load_option.xAxis = xAxis;
      load_option.yAxis = yAxis;
      load_option.series = series;
      load_option.tooltip = tooltip;
      load_option.title = {
        text: 'Array DC & AC Power Output',
        x: 'center',
      };

      // dispatch success status
      dispatch({
        type: 'SUCCESS_ENERGY',
        payload: load_option,
        displayMode: displayMode
      });
    } else if (displayMode.mode === 'month') {
      let load_option = {};
      let xAxis = {};
      let yAxis = {};
      let series = [];
      let tooltip = {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
          let tooltip_bar = Numeral(params[0].name).format('0o') + ' day <br/>';
          for (const param of params)
            tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' Wh <br/>';
          return tooltip_bar;
        },
      };
      xAxis.type = 'category';
      xAxis.name = 'Day of Month';
      xAxis.data = UtilFunctions.getDayOfMonthList(displayMode.month);
      yAxis.type = 'value';
      yAxis.name = 'AC Energy';
      yAxis.axisLabel = {
        formatter: (value) => (Numeral(value).format('0 a') + 'Wh')
      };

      let current_series;

      current_series = {};
      current_series.type = 'line';
      current_series.data = response_json.data["AC Power"];
      series.push(current_series);

      // load data
      load_option.xAxis = xAxis;
      load_option.yAxis = yAxis;
      load_option.series = series;
      load_option.tooltip = tooltip;
      load_option.title = {
        text: 'Array DC & AC Power Output',
        x: 'center',
      };

      // dispatch success status
      dispatch({
        type: 'SUCCESS_ENERGY',
        payload: load_option,
        displayMode: displayMode
      });
    } else if (displayMode.mode === 'day') {
      let load_option = {};
      let xAxis = {};
      let yAxis = {};
      let series = [];
      let legend = {};
      let tooltip = {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
          let tooltip_bar = Numeral(params[0].name).format('0o') + ' hour <br/>';
          for (const param of params)
            tooltip_bar += param.marker + param.seriesName + ': ' + Numeral(param.value).format('0,0') + ' W/M<sup>2</sup> <br/>';
          return tooltip_bar;
        },
      };
      xAxis.type = 'category';
      xAxis.name = 'Hour of Day';
      xAxis.data = UtilFunctions.getHourList();
      yAxis.type = 'value';
      yAxis.name = 'AC Power';
      yAxis.axisLabel = {
        formatter: (value) => (Numeral(value).format('0 a') + 'Wh')
      };

      legend.data = [];
      legend.x = 'center';
      legend.y = 'bottom';
      let current_series;

      // AC Power
      current_series = {};
      legend.data.push('AC Power');
      current_series.name = 'AC Power';
      current_series.type = 'line';
      current_series.data = response_json.data['AC Power'];
      current_series.barGap = '10%'; //柱图间距
      series.push(current_series);

      // DC Power
      current_series = {};
      legend.data.push('DC Power');
      current_series.name = 'DC Power';
      current_series.type = 'line';
      current_series.data = response_json.data['DC Power'];
      current_series.barGap = '10%'; //柱图间距
      series.push(current_series);

      // load data
      load_option.xAxis = xAxis;
      load_option.yAxis = yAxis;
      load_option.series = series;
      load_option.legend = legend;
      load_option.tooltip = tooltip;
      load_option.title = {
        text: 'Array DC & AC Power Output',
        x: 'center',
      };

      // dispatch success status
      dispatch({
        type: 'SUCCESS_ENERGY',
        payload: load_option,
        displayMode: displayMode
      });
    }
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const reload_energy = (displayMode) => (dispatch, getState) => {
  dispatch({
    type: 'RELOAD_ENERGY',
    displayMode: displayMode
  });
  dispatch(request_energy());
};

export const request_electricity_bill = () => (dispatch, getState) => {
  // load monthly electricity bill chart
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'ele_bill'
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    response_json = response_json.year;
    //console.log(response_json);
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let legend = {};
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = params[0].name + '<br/>';
        for (const param of params)
          tooltip_bar += param.marker + param.seriesName + ': $ ' + Numeral(param.value).format('0,0') + '<br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'category';
    xAxis.data = UtilFunctions.getMonthOfYearList();
    yAxis.type = 'value';
    yAxis.name = 'US Dollars';
    yAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 a'))
    };

    legend.data = [];
    legend.x = 'center';
    legend.y = 'bottom';
    let current_series;

    // before bill
    current_series = {};
    legend.data.push('Bill Before Solar');
    current_series.name = 'Bill Before Solar';
    current_series.type = 'bar';
    current_series.data = response_json.data["Bill Before Solar Value"];
    current_series.barGap = '10%'; //柱图间距
    series.push(current_series);

    // after bill
    current_series = {};
    legend.data.push('Bill After Solar');
    current_series.name = 'Bill After Solar';
    current_series.type = 'bar';
    current_series.data = response_json.data["Bill After Solar Value"];
    current_series.barGap = '10%'; //柱图间距
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.legend = legend;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Monthly Electricity Bill',
      x: 'center',
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_ELECTRICITY_BILL',
      payload: load_option
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const request_cash_flow = () => (dispatch, getState) => {
  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'financial'
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    response_json = response_json.year;
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = Numeral(params[0].name).format('0o') + ' year <br/>';
        for (const param of params)
          tooltip_bar += param.marker + '$ ' + Numeral(param.value).format('0,0') + '<br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'category';
    xAxis.name = 'Years';
    xAxis.data = [...Array(response_json.data["Cash Flow"].length)].map((v, k) => (k));
    yAxis.type = 'value';
    yAxis.name = 'US Dollars';
    yAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 a'))
    };

    let current_series;

    current_series = {};
    current_series.type = 'bar';
    current_series.data = response_json.data["Cash Flow"];
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Project Cash Flow',
      x: 'center',
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_CASH_FLOW',
      payload: load_option
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const request_board_working_condition_right = () => (dispatch, getState) => {
  let displayMode = getState().undoable.present.reportManager.displayMode;

  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'sample_array_vmp',
        date: mapMonthDayToAbb(displayMode.month, displayMode.day),
        inverter: mapInverterToAbb(displayMode.inverter)
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    //console.log(response_json);
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = Numeral(params[0].name).format('0o') + ' hour <br/>';
        for (const param of params)
          tooltip_bar += param.marker + param.seriesName + ': ' + Numeral(param.value).format('0,0.0') + ' V <br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'category';
    xAxis.name = 'Hour of Day';
    xAxis.nameLocation = 'center';
    xAxis.nameGap = 30;
    xAxis.data = UtilFunctions.getHourList();
    yAxis.type = 'value';
    yAxis.name = 'DC Voltage Output';
    yAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 a') + 'V')
    };

    let current_series;

    current_series = {};
    current_series.name = 'Voltage';
    current_series.type = 'line';
    current_series.data = response_json.data["Voltage"];
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Array DC Voltage Output',
      x: 'center',
    };
    load_option.grid = {
      bottom: '8%',
      containLabel: true,
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_BOARD_WORKING_CONDITION_RIGHT',
      payload: load_option,
      displayMode: displayMode
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const reload_board_working_condition_right = (displayMode) => (dispatch, getState) => {
  dispatch({
    type: 'RELOAD_BOARD_WORKING_CONDITION_RIGHT',
    displayMode: displayMode
  });
  dispatch(request_board_working_condition_right());
};

export const request_board_working_condition_left = () => (dispatch, getState) => {
  let displayMode = getState().undoable.present.reportManager.displayMode;

  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'sample_array_imp',
        date: mapMonthDayToAbb(displayMode.month, displayMode.day),
        inverter: mapInverterToAbb(displayMode.inverter)
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    //console.log(response_json);
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = Numeral(params[0].name).format('0o') + ' hour <br/>';
        for (const param of params)
          tooltip_bar += param.marker + param.seriesName + ': ' + Numeral(param.value).format('0,0.0') + ' A <br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'category';
    xAxis.name = 'Hour of Day';
    xAxis.nameLocation = 'center';
    xAxis.nameGap = 30;
    xAxis.data = UtilFunctions.getHourList();
    yAxis.type = 'value';
    yAxis.name = 'DC Current';
    yAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 a') + 'A')
    };

    let current_series;

    current_series = {};
    current_series.name = 'Current';
    current_series.type = 'line';
    current_series.data = response_json.data["Current"];
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Array DC Current Output',
      x: 'center',
    };
    load_option.grid = {
      bottom: '8%',
      containLabel: true,
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_BOARD_WORKING_CONDITION_LEFT',
      payload: load_option,
      displayMode: displayMode
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const reload_board_working_condition_left = (displayMode) => (dispatch, getState) => {
  dispatch({
    type: 'RELOAD_BOARD_WORKING_CONDITION_LEFT',
    displayMode: displayMode
  });
  dispatch(request_board_working_condition_left());
};

export const request_board_working_condition_center = () => (dispatch, getState) => {
  let displayMode = getState().undoable.present.reportManager.displayMode;

  axios.get(
    'http://ec2-18-220-161-68.us-east-2.compute.amazonaws.com:5000/report', {
      params: {
        id: getState().undoable.present.reportManager.reportId,
        'plot-name': 'sample_array_pmp',
        date: mapMonthDayToAbb(displayMode.month, displayMode.day),
        inverter: mapInverterToAbb(displayMode.inverter)
      }
    }
  )
  .then(response => response.data)
  .then(response_json => {
    //console.log(response_json);
    let load_option = {};
    let xAxis = {};
    let yAxis = {};
    let series = [];
    let tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        let tooltip_bar = Numeral(params[0].name).format('0o') + ' hour <br/>';
        for (const param of params)
          tooltip_bar += param.marker + param.seriesName + ': ' + Numeral(param.value).format('0,0.0') + ' W <br/>';
        return tooltip_bar;
      },
    };
    xAxis.type = 'category';
    xAxis.name = 'Hour of Day';
    xAxis.nameLocation = 'center';
    xAxis.nameGap = 30;
    xAxis.data = UtilFunctions.getHourList();
    yAxis.type = 'value';
    yAxis.name = 'DC Array Output';
    yAxis.axisLabel = {
      formatter: (value) => (Numeral(value).format('0 a') + 'W')
    };

    let current_series;

    current_series = {};
    current_series.name = 'Power (DC)';
    current_series.type = 'line';
    current_series.data = response_json.data["Power"];
    series.push(current_series);

    // load data
    load_option.xAxis = xAxis;
    load_option.yAxis = yAxis;
    load_option.series = series;
    load_option.tooltip = tooltip;
    load_option.title = {
      text: 'Array DC Power Output',
      x: 'center',
    };
    load_option.grid = {
      bottom: '8%',
      containLabel: true,
    };

    // dispatch success status
    dispatch({
      type: 'SUCCESS_BOARD_WORKING_CONDITION_CENTER',
      payload: load_option,
      displayMode: displayMode
    });
  })
  .catch(error => {
    // error handler
    console.log('[Error]: ', error);
  });
};

export const reload_board_working_condition_center = (displayMode) => (dispatch, getState) => {
  dispatch({
    type: 'RELOAD_BOARD_WORKING_CONDITION_CENTER',
    displayMode: displayMode
  });
  dispatch(request_board_working_condition_center());
};
