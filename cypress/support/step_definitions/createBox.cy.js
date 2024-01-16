import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";

const boxPage = require("../../fixtures/pages/boxPage.json");
let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let maxAmount = 50;
let currency = "Евро";
let newBoxIdentifier;

Given("box identifier created", function () {
  cy.get(boxPage.boxIdentifierField)
    .invoke("val")
    .then((value) => {
      newBoxIdentifier = value;
    });
});

Given("user creates a new box", function () {
  cy.createBox(newBoxName, maxAmount, currency);
});

export { newBoxIdentifier };
export { newBoxName };
