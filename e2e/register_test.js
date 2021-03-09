Feature("Register");

Scenario("Successfully register a user", ({ I }) => {
  I.amOnPage("https://turret.localhost:3000");

  I.see("A demonstration of OIDC flows and a general playground");

  I.click("Register");

  I.fillField("Name", "Ross Wilson");
  I.fillField("Email", "ross@example.com");
  I.fillField("Password", "somePassword");
  I.fillField("Confirm Password", "somePassword");

  I.click("Register");

  I.see("A demonstration of OIDC flows and a general playground");
});
