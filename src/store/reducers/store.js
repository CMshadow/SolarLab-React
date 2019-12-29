import { createStore } from 'redux';

import request_metadata from "./request_functions/request_metadata";
import request_loss from "./request_functions/request_loss";
import request_electricity_bill from "./request_functions/request_electricity_bill";
import request_pv_production from "./request_functions/request_pv_production";
import request_cash_flow from "./request_functions/request_cash_flow";

import { request_weather } from "./request_functions/request_weather";
import { request_energy } from "./request_functions/request_energy";
import { request_board_working_condition_left } from "./request_functions/request_board_working_condition_left";
import { request_board_working_condition_center } from "./request_functions/request_board_working_condition_center";
import { request_board_working_condition_right } from "./request_functions/request_board_working_condition_right";

// structure of global state
const defaultState = {
    metadata:                       { loaded: false, option: {} },
    loss:                           { loaded: false, option: {} },
    electricityBill:                { loaded: false, option: {} },
    pvProduction:                   { loaded: false, option: {} },
    cashFlow:                       { loaded: false, option: {} },

    displayMode:                    { mode: "year", month: 1, day: 1, inverter: 1 },
    weather:                        { loaded: false, option: {} },
    energy:                         { loaded: false, option: {} },
    boardWorkingConditionLeft:      { loaded: false, option: {} },
    boardWorkingConditionCenter:    { loaded: false, option: {} },
    boardWorkingConditionRight:     { loaded: false, option: {} },
};

// reducer: a function, renew and return a new state
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        // success responses (don't need reload)
        case 'SUCCESS_METADATA':                        state = {...state, metadata:                    { loaded: true, option: action.payload }}; break;
        case 'SUCCESS_LOSS':                            state = {...state, loss:                        { loaded: true, option: action.payload }}; break;
        case 'SUCCESS_ELECTRICITY_BILL':                state = {...state, electricityBill:             { loaded: true, option: action.payload }}; break;
        case 'SUCCESS_PV_PRODUCTION':                   state = {...state, pvProduction:                { loaded: true, option: action.payload }}; break;
        case 'SUCCESS_CASH_FLOW':                       state = {...state, cashFlow:                    { loaded: true, option: action.payload }}; break;

        // need reload data using date & mode
        case 'SUCCESS_WEATHER':                         state = {...state, displayMode: action.displayMode, weather: { loaded: true, option: action.payload } }; break;
        case 'SUCCESS_ENERGY':                          state = {...state, displayMode: action.displayMode, energy:  { loaded: true, option: action.payload } }; break;
        case 'SUCCESS_BOARD_WORKING_CONDITION_LEFT':    state = {...state, displayMode: action.displayMode, boardWorkingConditionLeft:   { loaded: true, option: action.payload }}; break;
        case 'SUCCESS_BOARD_WORKING_CONDITION_CENTER':  state = {...state, displayMode: action.displayMode, boardWorkingConditionCenter: { loaded: true, option: action.payload }}; break;
        case 'SUCCESS_BOARD_WORKING_CONDITION_RIGHT':   state = {...state, displayMode: action.displayMode, boardWorkingConditionRight:  { loaded: true, option: action.payload }}; break;

        case 'RELOAD_WEATHER':                          state = {...state, displayMode: action.displayMode, weather: { loaded: false } }; break;
        case 'RELOAD_ENERGY':                           state = {...state, displayMode: action.displayMode, energy:  { loaded: false } }; break;
        case 'RELOAD_BOARD_WORKING_CONDITION_LEFT':     state = {...state, displayMode: action.displayMode, boardWorkingConditionLeft:   { loaded: false }}; break;
        case 'RELOAD_BOARD_WORKING_CONDITION_CENTER':   state = {...state, displayMode: action.displayMode, boardWorkingConditionCenter: { loaded: false }}; break;
        case 'RELOAD_BOARD_WORKING_CONDITION_RIGHT':    state = {...state, displayMode: action.displayMode, boardWorkingConditionRight:  { loaded: false }}; break;

        default: return state;
    }
    return state;
};

const store = createStore(reducer);

// init state: send requests
request_metadata(store);
request_loss(store);
request_electricity_bill(store);
request_pv_production(store);
request_cash_flow(store);
request_board_working_condition_left(store);
request_board_working_condition_center(store);
request_board_working_condition_right(store);
request_energy(store);
request_weather(store);

export default store;
