Feature: Reterive persistent token from msf
  Can be used for subsequent exec calls

  Scenario: Client initialized with password and username
    Given username
    And password
    When initialized
    And getToken
    Then receive token