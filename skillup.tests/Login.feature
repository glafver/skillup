Feature: Login
  Som användare
  Vill jag kunna logga in
  För att komma åt mitt konto och börja quiz

  Scenario: Framgångsrik inloggning
    Given att användaren är på login-sidan
    When användaren fyller i korrekt användarnamn och lösenord
    And trycker på login-knappen
    Then ska användaren tas till startsidan

  Scenario: Misslyckad inloggning
    Given att användaren är på login-sidan
    When användaren fyller i fel användarnamn eller lösenord
    And trycker på login-knappen
    Then ska ett felmeddelande visas