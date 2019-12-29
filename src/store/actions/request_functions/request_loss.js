import Numeral from "./NumeralCustom";

let request_loss = (store) => {
    fetch('/mock/Loss.json')
        .then(response => response.json())
        .then(response_json => {

            // sort loss item & value
            let loss_item  = response_json.data["Loss Item"];
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
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                formatter: (value) => ( Numeral(value).format('0 %') )
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
            store.dispatch({ type: 'SUCCESS_LOSS', payload: load_option });
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};

export default request_loss;
