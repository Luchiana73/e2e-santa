import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { newBoxIdentifier } from "../step_definitions/createBox.cy";
import { newBoxName } from "../step_definitions/createBox.cy";

Given("user has got the box identifier", function () {
  cy.log(newBoxIdentifier);
});

Given("user deletes box", function () {
  cy.deleteBoxApi(newBoxIdentifier);
});

Given("box does not exist", function () {
  cy.get(newBoxName).should("not.exist");
});
