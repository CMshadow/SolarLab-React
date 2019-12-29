import UtilFunctions from "./UtilFunctions";
import Numeral from "./NumeralCustom";

let request_pv_production = (store) => {
    fetch('/mock/Monthly PV Production.json')
        .then(response => response.json())
        .then(response_json => {
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
                        tooltip_bar += param.marker + Numeral(param.value).format('0,0') + ' Wh<br/>';
                    return tooltip_bar;
                },
            };
            xAxis.type = 'category';
            xAxis.data = UtilFunctions.getMonthOfYearList();
            yAxis.type = 'value';
            yAxis.name = 'Energy';
            yAxis.axisLabel = {
                formatter: (value) => ( Numeral(value).format('0 a') + 'Wh' )
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
            store.dispatch({ type: 'SUCCESS_PV_PRODUCTION', payload: load_option });
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};

export default request_pv_production;
