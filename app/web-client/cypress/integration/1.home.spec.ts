export {};
describe("renders main screen", () => {
  beforeEach(function () {
    cy.visit("/");
  });
  it("renders logo", () => {
    cy.get("#coinsmart-logo").should("exist");
  });
  it("renders default channels", () => {
    cy.contains("GENERAL");
    cy.contains("TECHY FELLOWS");
  });
  it("open chat room uses chat feature", () => {
    cy.get("#general-room-btn").click();
    // check for username popup
    cy.contains("Enter your username");
    // check for OK button
    cy.get("#username-submit-btn").should("exist");
    // enter username
    cy.get("#username-input").click().type("cypressUsername");
    cy.get("#username-submit-btn").click();
    // check we are inside General chat room
    cy.contains("Welcome cypressUsername");
    // Check for default message
    cy.contains("Hi There im the first message");
    // Type message
    cy.get("#message-input").click().type("cypressChatMessage");
    // Press enter to send
    cy.get("#message-input").type("{enter}");
    // check that message is displayed
    cy.contains("cypressChatMessage");
    // check that delete icon is rendered
    cy.get("#delete-icon").should("exist");
    // delete message
    cy.get("#delete-icon").click();
    // check that message is gone
    cy.contains("cypressChatMessage").should("not.exist");
  });
});
