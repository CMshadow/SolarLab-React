import UtilFunctions from "./UtilFunctions";
import Numeral from "./NumeralCustom";

let request_board_working_condition_right = (store) => {
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

    fetch('/mock/Sample Array Pmp, Sample Array Imp, Sample Array Vmp (Board Working Condition).json')
        .then(response => response.json())
        .then(response_json => {
            //console.log(response_json);
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
                formatter: (value) => ( Numeral(value).format('0 a') + 'V' )
            };

            let current_series;

            current_series = {};
            current_series.name = 'aSAPM.v_mp';
            current_series.type = 'line';
            current_series.data = response_json.data["Power"];
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
            store.dispatch({ type: 'SUCCESS_BOARD_WORKING_CONDITION_RIGHT', payload: load_option, displayMode: displayMode });
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });


};

let reload_board_working_condition_right = (store, displayMode) => {
    store.dispatch({ type: 'RELOAD_BOARD_WORKING_CONDITION_RIGHT', displayMode: displayMode });
    request_board_working_condition_right(store);
};


export { request_board_working_condition_right, reload_board_working_condition_right }
