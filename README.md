# FiatConnect Widget

A web client for [FiatConnect](https://fiatconnect.org).

## Deployment

Deployment details differ by provider. You may find [this resource](https://create-react-app.dev/docs/deployment) helpful.

## FiatConnect Provider requirements

The FiatConnect Widget is intended to be an interface for any server offering a FiatConnect-compliant API. Besides
implementing a compliant API, the server must also be configured to allow cross-origin requests from the domain where
the widget is hosted, and must mark session cookies as `SameSite=None; Secure` to allow the widget to use them.

For more information on these requirements, you may consult these resources:

- [FiatConnect API Specification](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md)
- [SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained)
- [StackOverflow post on allowing cross-origin requests](https://stackoverflow.com/a/64504149/5807149)

## Implementation status

### Fiat Account Schemas supported

- [x] [AccountNumber](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9321-accountnumber)
- [ ] [MobileMoney](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9322-mobilemoney)
- [ ] [DuniaWallet](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9323-duniawallet)
- [ ] [IBANNumber](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9324-ibannumber)
- [ ] [IFSCAccount](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9325-ifscaccount)
- [ ] [PIXAccount](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9326-pixaccount)

### KYC Schemas supported

none at this time

### Transfer Types supported

- [x] Transfers In
- [ ] Transfers Out

### UserActionDetails Schemas supported

- [x] [AccountNumberUserAction](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9335-accountnumberuseraction)
- [ ] [URLUserAction](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9334-urluseraction)
- [ ] [IBANUserAction](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9332-ibanuseraction)
- [ ] [PIXUserAction](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#9331-pixuseraction)

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Environment variables

Environment variables are loaded in `src/config.ts`. See that module for details.

See [here](https://stackoverflow.com/a/46367006/5807149) for advice on setting environment variables for development or
for use in a production build.

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Runs jest tests.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

For many overrides that would otherwise require you to eject, you can use [react-app-rewired](https://www.npmjs.com/package/react-app-rewired),
and just update `config-overrides.js`. If you get compilation errors citing missing Webpack polyfills on v5, try this before ejecting.

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
