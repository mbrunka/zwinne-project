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