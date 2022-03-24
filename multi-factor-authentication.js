app.get('/generate-password', (request, response) => {
    const userLogin = request.body.username;
    const userPhoneNumber = request.body.phone;
    const generatedOneTimePassword = cryptoRandomString({
        length: 10,
        type: 'base64'
    });
    const userOneTimePassword = {
        userLogin: userLogin,
        userPhoneNumber: userPhoneNumber,
        password: generatedOneTimePassword
    };
    // Save one-time password for 15 minutes
    savePasswordForUser(userOneTimePassword, 15);

    sendPasswordViaSMS(userOneTimePassword, userPhoneNumber);
    response.status(200).send({
        message: 'Password generated and sent via SMS.'
    });
});

app.get('/log-in', (request, response) => {
    const userLogin = request.body.username;
    const userPassword = request.body.password;
    const userSMSPassword = request.body.smspassword;

    if (isLoginExisting(userLogin) 
        && userPassword === getPasswordForLogin(userLogin)
        && userSMSPassword === getOneTimePasswordForLogin(userLogin)) {
        const authToken = jwt.sign(
                { _id: getAuthTokenId() },
                getServerPrivateKey()
            );
        clearPasswordForUser(userLogin);
        response.status(200).send(authToken);
    } else {
        response.status(401).send({
            message: "Password or login is incorrect."
        })
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
        // Token verification unsuccessful, deny access to resources
        response.status(401).send({
            message: "Access token is incorrect."
        });
    }
});