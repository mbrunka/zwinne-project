*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    OperatingSystem
Library    String

Resource    ../resources/auth.resource

Variables    ../test_config/credentials.py
Variables    ../test_config/global.py

*** Test Cases ***
Create Project
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...                 AND    Login As Teacher    ${email_teacher}    ${password_teacher}
    ${project_name}    Generate Random String    8    [LETTERS][DIGITS]
    ${project_descr}    Generate Random String    32    [LETTERS][DIGITS]
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${data}    Create Dictionary    nazwa=${project_name}    opis=${project_descr}
    ${response}    POST On Session    base_url    /api/v1/projekty/teacher/create   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    201

Add Zadanie
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...                 AND    Login As Teacher    ${email_teacher}    ${password_teacher}
    ${task_name}    Generate Random String    8    [LETTERS][DIGITS]
    ${task_descr}    Generate Random String    32    [LETTERS][DIGITS]
    ${task_priority}    Generate Random String    1    [DIGITS]
    ${task_id_status}    Generate Random String    1    [DIGITS]
    ${task_id_project}    Generate Random String    1    [DIGITS]
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${data}    Create Dictionary    nazwa=${task_name}    opis=${task_descr}    priorytet=${task_priority}    statusId=${task_id_status}    projektId=${task_id_project}
    ${response}    POST On Session    base_url    /api/v1/projekty/task   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    201

Join Project
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...                 AND    Login As Student    ${email_student}    ${password_student}
    ${join_code}    Generate Random String    32    [LETTERS][DIGITS]
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${data}    Create Dictionary    joinCode=${join_code}
    ${response}    POST On Session    base_url    /api/v1/projekty/join   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200

Join Zadanie
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...                 AND    Login As Student    ${email_student}    ${password_student}
    ${data}    Create Dictionary
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${response}    POST On Session    base_url    /api/v1/projekty/task/1/join   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200