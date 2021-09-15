it("Audience role user create question as named-user and anonymous", () => {
  cy.visit("/event/79c91916-9c28-4e63-ab23-38ec777e7541/login");
  cy.contains("Join event").click();

  cy.wait(5000)
    .get("[rows='3']")
    .click({ force: true })
    .should("have.focus")
    .type("anonymous-user question", { force: true });
  cy.contains("Send").click({ force: true });

  cy.wait(2000)
    .get("[rows='3']")
    .click({ force: true })
    .should("have.focus")
    .type("named-user question", { force: true });
  cy.contains("As anonymous").click({ force: true });
  cy.contains("Send").click({ force: true });

  cy.wait(2000)
    .get("[rows='3']")
    .click({ force: true })
    .should("have.focus")
    .type("anonymous-user question again", { force: true });
  cy.contains("As anonymous").click({ force: true });
  cy.contains("Send").click({ force: true });

  cy.wait(2000)
    .get(".MuiListItem-root .MuiTypography-colorTextPrimary")
    .should(($lis) => {
      expect($lis.eq(0)).to.contain("Anonymous");
      expect($lis.eq(1)).to.contain("named-user");
      expect($lis.eq(2)).to.contain("Anonymous");
    });
});
