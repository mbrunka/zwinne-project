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

Register Teacher As Admin With Random Email
    [Arguments]    ${variables_level}=suite
    Create Session    register    ${BASE_URL}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    VAR    ${TEST_ACCOUNT_EMAIL}    ${random}@test.com    scope=${variables_level}
    VAR    ${TEST_ACCOUNT_PASSWORD}    ${random}    scope=${variables_level}
    ${data}    Create Dictionary    email=${random}@test.pl    password=${TEST_ACCOUNT_PASSWORD}   first_name=John    last_name=Doe 
    ${response}    POST On Session    register    /api/v1/auth/admin/registerTeacher   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200
    RETURN    ${TEST_ACCOUNT_EMAIL}    ${TEST_ACCOUNT_PASSWORD}
