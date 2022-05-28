# microsoft365-e5-autoapi

## OAuth Endpoint
https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2F&response_mode=query&scope=offline_access+Files.Read.All+Files.ReadWrite.All+Sites.Read.All+Sites.ReadWrite.All+User.Read.All+User.ReadWrite.All+Directory.Read.All+Directory.ReadWrite.All+Mail.Read+Mail.ReadWrite+MailboxSettings.Read+MailboxSettings.ReadWrite

## Redeem access token
<pre>
curl -X POST https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token \
-d "client_id=" \
-d "client_secret=" \
-d "code=" \
-d "grant_type=authorization_code" \
-d "redirect_uri=http%3A%2F%2Flocalhost%2F"
</pre>

## Test access token
<pre>
curl https://graph.microsoft.com/v1.0/me -H "Authorization: {access_token}"
</pre>
