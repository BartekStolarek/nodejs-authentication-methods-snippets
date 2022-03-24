app.get('/log-in', (request, response) => {
    const userLogin = request.body.username;
    const userPassword = request.body.password;

    if (isLoginExisting(userLogin) 
        && userPassword === getPasswordForLogin(userLogin)) {
        // Authentication data verified, creating session
        request.session.loggedIn = true;
        response.redirect('/application-page');
    } else {
        // Incorrect authentication data
        response.status(401).send({
            message: "Password or login is incorrect."
        });
    }
});

app.get('/log-out', (request, response) => {
    // Destory session for user
    request.session.destroy(() => {});
    response.status(200).send({
        message: 'You are logged out.'
    });
});

app.get('/requested-resource', (request, response) => {
    if (request.session && request.session.loggedIn) {
        // User is logged in, allow accessing resources
        getRequestedResources();
    } else {
        // User is not logged in, redirect to the login page
        response.redirect('/login-page');
    }
});