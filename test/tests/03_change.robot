*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    OperatingSystem
Library    String

Resource    ../resources/auth.resource

Variables    ../test_config/credentials.py
Variables    ../test_config/global.py

*** Test Cases ***
Change Email
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...    AND    Login As Teacher    ${email_teacher}    ${password_teacher}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${data}    Create Dictionary    password=${password_teacher}    newEmail=${new_email_teacher}
    ${response}    POST On Session    base_url    /api/v1/user/changeEmail   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200

Change Password
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...    AND    Login As Teacher    ${email_teacher}    ${password_teacher}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${data}    Create Dictionary    oldPassword=${password_teacher}    newPassword=${new_password_teacher}
    ${response}    POST On Session    base_url    /api/v1/user/changePassword   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200