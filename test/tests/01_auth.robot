*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    OperatingSystem
Library    String

*** Variables ***
${BASE_URL}    http://localhost:8080
${TOKEN}    
${PASSWORD}    1234

*** Test Cases ***
Register User
    [Setup]   Create Session    base_url    ${BASE_URL}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    ${random_idex}    Generate Random String    6    [DIGITS]
    VAR    ${TESTSING_ACCOUNT}    ${random}@test.pl
    ${data}    Create Dictionary    email=${random}@test.pl    password=${PASSWORD}   first_name=John    last_name=Doe    nrIndeksu=${random_idex}   stacjonarny=${True}
    ${response}    POST On Session    base_url    /api/v1/auth/register    headers=${headers}    json=${data}
    Log    ${response.content}
    Should Be Equal As Strings    ${response.status_code}    200
    ${response_json}    Convert To String    ${response.content}
    ${response_json}    Evaluate    json.loads($response_json)
    Should Not Be Empty    ${response_json}[authToken]
    Should Not Be Empty    ${response_json}[refreshToken]

    [Teardown]    Delete All Sessions