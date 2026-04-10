describe("Offline Mock API Test", () => {

  it("should fake a login API without frontend or backend", () => {

    cy.intercept("POST", "/api/users/login", {
      statusCode: 200,
      body: {
        message: "Login successful",
        token: "fake-token",
        user: { name: "Super Admin", role: "superAdmin" }
      }
    }).as("loginMock")

    // Use cy.request with relative URL + intercept only
    cy.request({
      method: "POST",
      url: "/api/users/login", // relative URL
      body: { email: "superadmin@gmail.com", password: "pawan123" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq("Login successful")
      expect(response.body.user.role).to.eq("superAdmin")
    })

  })

})