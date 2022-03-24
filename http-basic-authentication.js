app.use((request, response, next) => {
    if (request.headers && request.headers.authorization) {
      // Download login and password from headers and decode them
      const userAuthInBase64 = req.headers.authorization.split(' ')[1];
      const userAuthEncoded = Buffer
          .from(userAuthInBase64, 'base64')
          .toString();
      const userLogin = userAuthEncoded.split(':')[0];
      const userPassword = userAuthEncoded.split(':')[1];
  
      // Verify if login and password are matching
      if (isLoginExisting(userLogin)) {
          if (userPassword === getPasswordForLogin(userLogin)) {
              // Verification successful
              return next();
          } else {
              // Password does not match
              response.status(401).send({
                  message: 'Invalid password.'
              });
          }
      } else {
          // Login was not found in the database
          response.status(401).send({
              message: 'Invalid username.'
          });
      }
    }
});