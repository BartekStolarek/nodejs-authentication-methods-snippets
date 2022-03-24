app.get('/log-in', (request, response) => {
    const userLogin = request.body.username;
    const userPassword = request.body.password;

    if (isLoginExisting(userLogin) 
        && userPassword === getPasswordForLogin(userLogin)) {
            const authToken = jwt.sign(
                    { _id: getAuthTokenId() },
                    getServerPrivateKey()
                );
            response.status(200).send(authToken);
    } else {
        response.status(401).send({
            message: "Password or login is incorrect."
        });
    }
});

app.get('/requested-resource', (request, response) => {
    try {
        const userToken = request.header['x-auth-token'];
        const decodedToken = jwt.verify(userToken, getServerPrivateKey());
        request.userId = decodedToken;

        // Token verification successful, allow user to access resources
        getRequestedResourcesForUser(request.userId);
    } catch (error) {
        // Token verification unsuccessful
        response.status(401).send({
            message: "Access token is incorrect."
        });
    }
});