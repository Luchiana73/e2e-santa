import { Given } from "@badeball/cypress-cucumber-preprocessor";

const users = require("../../fixtures/users.json");

Given("user is on secret santa login page", function () {
  cy.visit("/login");
});

// When("user logs in", function () {
//   cy.login(users.userAuthor.email, users.userAuthor.password);
// });

Given("user logs in as {string} and {string}", function (string, string2) {
  cy.login(string, string2);
});

Given(
  "user logs in using login {string} and password {string}",
  function (login, password) {
    cy.login(login, password);
  }
);

Given("user is on dashboard page", function () {
  cy.contains("Создать коробку").click();
});

Given("user logs out", function () {
  cy.clearCookies();
});
