import Numeral from "./NumeralCustom";

let request_cash_flow = (store) => {
    fetch('/mock/Cash Flow.json')
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
                formatter: (value) => ( Numeral(value).format('0 a') )
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
            store.dispatch({ type: 'SUCCESS_CASH_FLOW', payload: load_option });
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};

export default request_cash_flow;
