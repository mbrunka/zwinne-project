*** Settings ***
Library    RequestsLibrary

*** Keywords ***
Login As Teacher
    [Arguments]    ${email}    ${password}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${data}    Create Dictionary    email=${email}    password=${password}
    ${response}    POST On Session    base_url    /api/v1/auth/login   headers=${headers}    json=${data}
    ${response_json}    Convert To String    ${response.content}
    ${response_json}    Evaluate    json.loads($response_json)
    VAR    ${AuthToken}    Bearer ${response_json}[authToken]    scope=TEST
    RETURN    ${AuthToken}

Login As Student
    [Arguments]    ${email}    ${password}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${data}    Create Dictionary    email=${email}    password=${password}
    ${response}    POST On Session    base_url    /api/v1/auth/login   headers=${headers}    json=${data}
    ${response_json}    Convert To String    ${response.content}
    ${response_json}    Evaluate    json.loads($response_json)
    VAR    ${AuthToken}    Bearer ${response_json}[authToken]    scope=TEST
    RETURN    ${AuthToken}