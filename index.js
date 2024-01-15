let api_url = 'https://api.testopscenter.com/v1'
let platform = 'Cyppress';
let session_id;

function connect(on, team_spkey, version_name) {

    on('before:run', async () => {
        session_id = await get_session_id(team_spkey, version_name);
    })

    on('after:spec', async (spec, results) => {
        await save_test_results(session_id, results);
    })

    on('after:run', async () => {
        await complete_test_session(session_id);
    })

}

async function get_session_id(team_spkey, version) {
    const get_session_body = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'team_key': team_spkey,
            'platform': platform,
            'version': version
        })
    }
    const response = await fetch(api_url + '/get_automation_session/cypress', get_session_body);
    const responseData = await response.json();
    return responseData.Session_ID
}

async function save_test_results(session_id, results) {
    var result;
    for (var i = 0; i < results.tests.length; i++) {
        if (results.tests[i].state == "passed") {
            result = "Done"
        } else if (results.tests[i].state == "pending") {
            result = "Skip"
        } else {
            result = "Fail"
        }
        var errorValue = results.tests[i].displayError !== null ? results.tests[i].displayError : null;
        const save_test_result_body = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'session_id': session_id,
                'test_name': `${results.tests[i].title[0]} - ${results.tests[i].title[1]}`,
                'test_result': result,
                'error_log': errorValue
            })
        }
        await fetch(api_url + '/save-test-result/cypress', save_test_result_body);
    }
}

async function complete_test_session(session_id) {
    const stop_session_body = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'session_id': session_id
        })
    }
    await fetch(api_url + '/stop-automation-session/cypress', stop_session_body);
}

module.exports = {
    connect
};