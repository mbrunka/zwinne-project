*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    OperatingSystem
Library    String

Resource    ../resources/auth.resource

Variables    ../test_config/credentials.py
Variables    ../test_config/global.py

Suite Setup    Run Keywords    Register Teacher As Admin With Random Email
...                     AND    Register Student With Random Email

*** Test Cases ***
Create Project
    VAR    ${SUITE_PROJECT_ID}    10    scope=suite
#    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
#    ...        AND             Login As Teacher    ${SUITE_ACCOUNT_EMAIL}    ${SUITE_ACCOUNT_PASSWORD}
#    ${project_name}    Generate Random String    8    [LETTERS][DIGITS]
#    ${project_descr}    Generate Random String    32    [LETTERS][DIGITS]
#    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
#    ${data}    Create Dictionary    nazwa=${project_name}    opis=${project_descr}
#    ${response}    POST On Session    base_url    /api/v1/projekty/teacher/create   headers=${headers}    json=${data}
#    VAR    ${SUITE_PROJECT_ID}    ${response.headers['Location'].split('/')[-1]}    scope=suite
#    Should Be Equal As Strings    ${response.status_code}    201

Add Zadanie
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...        AND             Login As Teacher    ${SUITE_ACCOUNT_EMAIL}    ${SUITE_ACCOUNT_PASSWORD}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${task_name}    Generate Random String    8    [LETTERS][DIGITS]
    ${task_descr}    Generate Random String    32    [LETTERS][DIGITS]
    ${response}    GET On Session    base_url    /api/v1/projekty/${SUITE_PROJECT_ID}    headers=${headers}
    VAR    ${SUITE_JOIN_CODE}    ${response.json()['joinCode']}    scope=suite
    VAR    ${SUITE_STATUS_ID}    ${response.json()['statusy'][0]['statusId']}    scope=suite
    ${task_priority}    Generate Random String    1    [DIGITS]
    ${data}    Create Dictionary    nazwa=${task_name}    opis=${task_descr}    priorytet=${task_priority}    statusId=${SUITE_STATUS_ID}    projektId=${SUITE_PROJECT_ID}
    ${response}    POST On Session    base_url    /api/v1/projekty/task   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200

Join Project As Student
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...                 AND    Login As Student    ${SUITE_STUDENT_ACCOUNT_EMAIL}    ${SUITE_STUDENT_ACCOUNT_PASSWORD}

    ${join_code}    Generate Random String    32    [LETTERS][DIGITS]
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${data}    Create Dictionary    joinCode=${SUITE_JOIN_CODE}
    ${response}    POST On Session    base_url    /api/v1/projekty/join   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200

Join Zadanie As Student
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...                 AND    Login As Student    ${SUITE_STUDENT_ACCOUNT_EMAIL}    ${SUITE_STUDENT_ACCOUNT_PASSWORD}
    ${data}    Create Dictionary
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${response}    POST On Session    base_url    /api/v1/projekty/task/1/join   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200