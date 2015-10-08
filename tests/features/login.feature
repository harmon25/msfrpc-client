Feature: Initialize a new client
  Can be used for subsequent exec calls

  Scenario: Client initialized with no password or token
    When initialized
    And after .5 seconds
    Then client should not have token

  Scenario: Client initialized with password and username
    Given username
    And password
    When initialized
    And after .5 seconds
    Then client should have token

  Scenario: Client initialized with token
    Given token
    When initialized
    Then client should have token