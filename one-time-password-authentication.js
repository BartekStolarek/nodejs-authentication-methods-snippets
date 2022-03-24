app.get('/generate-password', (request, response) => {
    const userLogin = request.body.username;
    const generatedOneTimePassword = cryptoRandomString({
        length: 10,
        type: 'base64'
    });
    const userOneTimePassword = {
        userLogin: userLogin,
        password: generatedOneTimePassword
    };
    // Save one-time password for 15 minutes
    savePasswordForUser(userOneTimePassword, 15);

    response.status(200).send(userOneTimePassword);
});

app.get('/requested-resource', (request, response) => {
    const userLogin = request.body.username;
    const userPassword = request.body.password;

    if (isLoginExisting(userLogin)
        && userPassword === getPasswordForUser(userLogin)) {
        // Password validation successful, allow user to access resources
        getRequestedResourcesForUser();

        // Delete one-time password for user
        clearPasswordForUser(userLogin);
    } else {
        // Password validation unsuccessful, deny access to resources
        response.status(401).send({
            message: 'Incorrect password.'
        });
    }
});