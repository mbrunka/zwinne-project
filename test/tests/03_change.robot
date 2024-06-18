*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    OperatingSystem
Library    String

Resource    ../resources/auth.resource

Variables    ../test_config/credentials.py
Variables    ../test_config/global.py

Suite Setup    Register Teacher As Admin With Random Email

*** Test Cases ***
Change Email
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...        AND             Login As Teacher    ${SUITE_ACCOUNT_EMAIL}    ${SUITE_ACCOUNT_PASSWORD}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    ${data}    Create Dictionary    password=${SUITE_ACCOUNT_PASSWORD}    newEmail=${random}@test.pl
    VAR    ${SUITE_ACCOUNT_EMAIL}    ${random}@test.pl    scope=suite
    ${response}    POST On Session    base_url    /api/v1/user/changeEmail   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200

Change Password
    [Setup]    Run Keywords    Create Session    base_url    ${BASE_URL}
    ...        AND             Login As Teacher    ${SUITE_ACCOUNT_EMAIL}    ${SUITE_ACCOUNT_PASSWORD}
    ${headers}    Create Dictionary    Content-Type=application/json    Authorization=${AuthToken}
    ${random}    Generate Random String    8    [LETTERS][DIGITS]
    ${data}    Create Dictionary    oldPassword=${SUITE_ACCOUNT_PASSWORD}    newPassword=${random}
    ${response}    POST On Session    base_url    /api/v1/user/changePassword   headers=${headers}    json=${data}
    Should Be Equal As Strings    ${response.status_code}    200