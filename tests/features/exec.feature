Feature: Run API Commands

  Scenario: Client initialized with password and username
    Given username
    And password
    When initialized
    And after .5 seconds
    Then client should have token
    And exec should return a response

  Scenario: Client initialized with token
    Given token
    When initialized
    Then client should have token
    And exec should return a response
