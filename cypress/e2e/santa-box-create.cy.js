const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const menuBoxesPage = require("../fixtures/pages/menuBoxesPage.json");
const deleteBoxPage = require("../fixtures/pages/deleteBoxPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.contains("Создать коробку").click();
    cy.waitUntil(
      () => cy.contains("Придумайте название коробке").should("be.visible"),
      { timeout: 10000 }
    );
    cy.get(boxPage.boxNameField).should("be.visible").type(newBoxName);
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).should("be.visible").click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAnount).should("be.visible").type(maxAmount);
    cy.get(boxPage.currency).should("be.visible").select(currency);
    cy.get(generalElements.arrowRight).should("be.visible").click();
    cy.get(generalElements.arrowRight).click();
    cy.contains("Дополнительные настройки").should("be.visible");
    cy.get(generalElements.arrowRight).click();
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants via link", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("approve as user1", () => {
    let wishes = `${faker.word.noun()} ${faker.word.adverb()} ${faker.word.adjective()}`;
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users.user1.email, users.user1.password);
    cy.contains("Создать карточку участника").should("exist");
    cy.createParticipantCard(wishes);
    cy.clearCookies();
  });

  it("approve as user2", () => {
    let wishes = `${faker.word.noun()} ${faker.word.adverb()} ${faker.word.adjective()}`;
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users.user2.email, users.user2.password);
    cy.contains("Создать карточку участника").should("exist");
    cy.createParticipantCard(wishes);
    cy.clearCookies();
  });

  it("add user 3 and user 4 manually", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.waitUntil(
      () => cy.get(menuBoxesPage.menuBoxesLink).should("be.visible"),
      { timeout: 10000 }
    );
    cy.get(menuBoxesPage.menuBoxesLink).click();
    cy.get(menuBoxesPage.boxCard).click();
    cy.get(menuBoxesPage.menuButtonToggle).click();
    cy.contains("Добавить участников").click({ force: true });
    cy.get(invitePage.invitationToggle).check({ force: true });
    cy.addUserManually(users.user3, 1);
    cy.addUserManually(users.user4, 3);
    cy.get(invitePage.inviteButton).click();
  });

  after("delete box", () => {
    cy.get(menuBoxesPage.menuButtonToggle).click();
    cy.contains("Архивация и удаление").click({ force: true });
    cy.get(deleteBoxPage.deleteBoxField).type("Удалить коробку");
    cy.get(deleteBoxPage.deleteBoxButton).click();
  });
});
