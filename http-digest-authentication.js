const createMD5Hash = (dataToEncrypt) => {
    const hashedData = crypto
        .createHash('md5')
        .update(dataToEncrypt)
        .digest('hex');

    return hashedData;
};

const createAuthentication = (response) => {
    response.status(401).send({
        'WWW-Authenticate': `Digest realm='${getRealm()}', 
        nonce='${getRandomNumber()}', 
        opaque='${getMD5Hash()}'},
        qop='auth'`
    });
};

app.use((request, response, next) => {
    if (request.headers && request.headers.authorization) {
        // Get authentication data from headers, decode and split them
        const parsedAuthorization = parseAuthorizationData(request.headers.authorization);

      // Verify authentication data
      if (isLoginExisting(parsedAuthorization.username)) {
        const HA1 = createMD5Hash(
            parsedAuthorization.username,
            parsedAuthorization.password, 
            ':',
            getRealm(), 
            ':', 
            getUserPassword()
        );
        const HA2 = createMD5Hash(
            request.method,
            ':', 
            parsedAuthorization.uri
        );
        const expectedResponse = createMD5Hash(
            HA1,
            parsedAuthorization.nonce, 
            parsedAuthorization.nc,
            parsedAuthorization.cnonce, 
            parsedAuthorization.qop, 
            HA2
        );
        const expectedBuiltResponse = expectedResponse.join(':');

        if (parsedAuthorization === expectedBuiltResponse) {
            // Verification successful
            response.status(200).send({
                message: 'Requested data.'
            });
        } else {
            // Provide initial authentication
            createAuthentication(response);
        }
      } else {
        // Provide initial authentication
        createAuthentication(response);
      }
    } else {
        // Provide initial authentication
        createAuthentication(response);
    }
});