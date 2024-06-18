*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    OperatingSystem
Library    String

Resource    ../resources/auth.resource

Variables    ../test_config/credentials.py
Variables    ../test_config/global.py

*** Variables ***
${TOKEN}    
${PASSWORD}    1234

*** Test Cases ***
Register Student
    [Setup]   Create Session    base_url    ${BASE_URL}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    ${random_idex}    Generate Random String    6    [DIGITS]
    VAR    ${EMAIL_STUDENT}    ${random}@test.pl    scope=suite
    ${data}    Create Dictionary    email=${EMAIL_STUDENT}    password=${PASSWORD}   first_name=John    last_name=Doe    nrIndeksu=${random_idex}   stacjonarny=${True}
    ${response}    POST On Session    base_url    /api/v1/auth/register    headers=${headers}    json=${data}
    Log    ${response.content}
    Should Be Equal As Strings    ${response.status_code}    200
    ${response_json}    Convert To String    ${response.content}
    ${response_json}    Evaluate    json.loads($response_json)
    Should Not Be Empty    ${response_json}[authToken]
    Should Not Be Empty    ${response_json}[refreshToken]
    [Teardown]    Delete All Sessions

Register Teacher Candidate
    [Setup]   Create Session    base_url    ${BASE_URL}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    ${data}    Create Dictionary    email=${random}@test.pl    password=${PASSWORD}   first_name=John    last_name=Doe 
    ${response}    POST On Session    base_url    /api/v1/auth/registerTeacher    headers=${headers}    json=${data}
    Log    ${response.content}
    Should Be Equal As Strings    ${response.status_code}    200
    ${response_json}    Convert To String    ${response.content}
    ${response_json}    Evaluate    json.loads($response_json)
    Should Not Be Empty    ${response_json}[authToken]
    Should Not Be Empty    ${response_json}[refreshToken]
    [Teardown]    Delete All Sessions

Register Teacher As Admin
    [Setup]   Create Session    base_url    ${BASE_URL}
    ${headers}    Create Dictionary    Content-Type=application/json
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    VAR    ${EMAIL_TEACHER}    ${random}@test.pl    scope=suite
    ${data}    Create Dictionary    email=${EMAIL_TEACHER}    password=${PASSWORD}   first_name=John    last_name=Doe 
    ${response}    POST On Session    base_url    /api/v1/auth/admin/registerTeacher   headers=${headers}    json=${data}
    Log    ${response.content}
    Should Be Equal As Strings    ${response.status_code}    200
    ${response_json}    Convert To String    ${response.content}
    ${response_json}    Evaluate    json.loads($response_json)
    Should Not Be Empty    ${response_json}[authToken]
    Should Not Be Empty    ${response_json}[refreshToken]
    [Teardown]    Delete All Sessions

Login Teacher
    [Setup]    Create Session    base_url    ${BASE_URL}
    Login As Teacher    ${EMAIL_TEACHER}    ${PASSWORD}

Login Student
    [Setup]    Create Session    base_url    ${BASE_URL}
    Login As Teacher    ${EMAIL_STUDENT}    ${PASSWORD}