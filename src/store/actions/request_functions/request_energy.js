import UtilFunctions from "./UtilFunctions";
import Numeral from "./NumeralCustom";

let request_energy = (store) => {
    let displayMode = store.getState().displayMode;
    // process url here
    // fake process
    let URL = '/';
    if (displayMode.mode === 'year') {
        URL = '/mock/Sample DC and AC Power Output of Single PV Array Year.json';
    }
    else if (displayMode.mode === 'month') {
        URL = '/mock/Sample DC and AC Power Output of Single PV Array Month.json';
    }
    else if (displayMode.mode === 'day') {
        URL = '/mock/Sample DC and AC Power Output of Single PV Array Day.json';
    }

    fetch(URL)
        .then(response => response.json())
        .then(response_json => {
            if (displayMode.mode === 'year') {
                let load_option = {};
                let xAxis = {};
                let yAxis = {};
                let series = [];
                let tooltip = {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                    formatter: (value) => ( Numeral(value).format('0 a') + 'Wh' )
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
                store.dispatch({ type: 'SUCCESS_ENERGY', payload: load_option, displayMode: displayMode });
            }
            else if (displayMode.mode === 'month') {
                let load_option = {};
                let xAxis = {};
                let yAxis = {};
                let series = [];
                let tooltip = {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                    formatter: (value) => ( Numeral(value).format('0 a') + 'Wh' )
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
                store.dispatch({ type: 'SUCCESS_ENERGY', payload: load_option, displayMode: displayMode });
            }
            else if (displayMode.mode === 'day') {
                let load_option = {};
                let xAxis = {};
                let yAxis = {};
                let series = [];
                let legend = {};
                let tooltip = {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                    formatter: (value) => ( Numeral(value).format('0 a') + 'Wh' )
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
                current_series.barGap = '10%';  //柱图间距
                series.push(current_series);

                // DC Power
                current_series = {};
                legend.data.push('DC Power');
                current_series.name = 'DC Power';
                current_series.type = 'line';
                current_series.data = response_json.data['DC Power'];
                current_series.barGap = '10%';  //柱图间距
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
                store.dispatch({ type: 'SUCCESS_ENERGY', payload: load_option, displayMode: displayMode });
            }
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};


let reload_energy = (store, displayMode) => {
    store.dispatch({ type: 'RELOAD_ENERGY', displayMode: displayMode });
    request_energy(store);
};


export { request_energy, reload_energy }
