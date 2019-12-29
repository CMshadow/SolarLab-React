import UtilFunctions from "./UtilFunctions";
import Numeral from "./NumeralCustom";

let request_electricity_bill = (store) => {
    // load monthly electricity bill chart
    fetch('/mock/Monthly Electricity Bill.json')
        .then(response => response.json())
        .then(response_json => {
            //console.log(response_json);
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
                formatter: (value) => ( Numeral(value).format('0 a') )
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
            current_series.barGap = '10%';  //柱图间距
            series.push(current_series);

            // after bill
            current_series = {};
            legend.data.push('Bill After Solar');
            current_series.name = 'Bill After Solar';
            current_series.type = 'bar';
            current_series.data = response_json.data["Bill After Solar Value"];
            current_series.barGap = '10%';  //柱图间距
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
            store.dispatch({ type: 'SUCCESS_ELECTRICITY_BILL', payload: load_option });
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};

export default request_electricity_bill;
