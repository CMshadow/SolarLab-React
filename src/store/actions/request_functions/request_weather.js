import UtilFunctions from "./UtilFunctions";
import Numeral from "./NumeralCustom";

let request_weather = (store) => {
    let displayMode = store.getState().displayMode;
    // process url here
    // fake process
    let URL = '/';
    if (displayMode.mode === 'year') {
        URL = '/mock/POA Irradiance Components TM3 Year.json';
    }
    else if (displayMode.mode === 'month') {
        URL = '/mock/POA Irradiance Components TM3 Month.json';
    }
    else if (displayMode.mode === 'day') {
        URL = '/mock/POA Irradiance Components TM3 Day.json';
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
                            tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' W/M<sup>2</sup> <br/>';
                        return tooltip_bar;
                    },
                };
                xAxis.type = 'category';
                xAxis.data = UtilFunctions.getMonthOfYearList();
                yAxis.type = 'value';
                yAxis.name = 'Irradiance (W/M²)';
                yAxis.axisLabel = {
                    formatter: (value) => ( Numeral(value).format('0 a') )
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
                store.dispatch({ type: 'SUCCESS_WEATHER', payload: load_option, displayMode: displayMode });
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
                    formatter: (value) => ( Numeral(value).format('0 a') )
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
                store.dispatch({ type: 'SUCCESS_WEATHER', payload: load_option, displayMode: displayMode });
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
                yAxis.name = 'Irradiance (W/M²)';
                yAxis.axisLabel = {
                    formatter: (value) => ( Numeral(value).format('0 a') )
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
                current_series.barGap = '10%';  //柱图间距
                series.push(current_series);

                // Sky Diffuse Irradiance
                current_series = {};
                legend.data.push('Sky Diffuse Irradiance');
                current_series.name = 'Sky Diffuse Irradiance';
                current_series.type = 'line';
                current_series.data = response_json.data['Sky Diffuse Irradiance'];
                current_series.barGap = '10%';  //柱图间距
                series.push(current_series);

                // Ground Reflected Irradiance
                current_series = {};
                legend.data.push('Ground Reflected Irradiance');
                current_series.name = 'Ground Reflected Irradiance';
                current_series.type = 'line';
                current_series.data = response_json.data['Ground Reflected Irradiance'];
                current_series.barGap = '10%';  //柱图间距
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
                store.dispatch({ type: 'SUCCESS_WEATHER', payload: load_option, displayMode: displayMode });
            }
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};


let reload_weather = (store, displayMode) => {
    store.dispatch({ type: 'RELOAD_WEATHER', displayMode: displayMode });
    request_weather(store);
};


export { request_weather, reload_weather }
