let request_metadata = (store) => {
    fetch('/mock/Get Report Meta Data.json')
        .then(response => response.json())
        .then(response_json => {
            let load_option = response_json;
            // set document title
            document.title = load_option['data']['Project_Name'] + ' - Albedo';
            store.dispatch({ type: 'SUCCESS_METADATA', payload: load_option });
        })
        .catch(error => {
            // error handler
            console.log('[Error]: ', error);
        });
};

export default request_metadata;
