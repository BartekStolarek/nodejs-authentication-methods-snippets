// Middleware
app.use(
    session({
        name: 'my-app-session',
        cookie: { httpOnly: true },
        secret: getSecret()
    })
);

// Configure third-party provider authentication server credentials
const oidc = new ExpressOIDC({
    client_id: getClientID(),
    client_secret: getClientSecret(),
    issuer: getIssuer(),
    redirect_uri: 'my-application/callback',
    routes: {
        callback: { defaultRedirect: '/application-page' }
    }
});

// Routes
app.use(oidc.router);

app.get('/requested-resource', oidc.ensureAuthenticated(), (request, response) => {
    // User is authenticated, allow access to resources
    getRequestedResources();
});

app.get('/log-out', (request, response) => {
    // Destory user's session
    request.logout();
    response.redirect('home-page');
});