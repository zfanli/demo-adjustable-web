# demo-adjustable-web

Demonstrate an adjustable web UI.

## TODOs

- [ ] Base on React > v16
  - [ ] use typescript
  - [ ] router for cover other situations
  - [ ] redux for integrate configurations
- [ ] Animation library - react-spring
  - [ ] basic usage for recall
  - [ ] Alternatives - react-motion (maybe)
  - [ ] ~~Alternatives - animated (perhaps not)~~
- [ ] Topics - Debounce & Throttle for best performance
  - [ ] debounce
  - [ ] throttle
- [ ] Thinking - How to layout? Flex or Table?
  - [ ] maybe table view because rowspan can merge cells across line
  - [ ] but flex is more flexible to layout
- [ ] Tool - UI Component Library for fast start
- [ ] Working Flow
  - [ ] statics version web
    - [ ] `Header` component
    - [ ] `Content` component
    - [ ] `Footer` component
    - [ ] `Panel` component
    - [ ] extract configs to file
    - [ ] loading configs to redux store
  - [ ] add interaction to it
    - [ ] refactor `Panel` to be sortable
    - [ ] refactor `Panel` to be draggable
    - [ ] refactor `Panel` to be resizable
    - [ ] refactor `Panel` to be collapsible
    - [ ] refactor `Panel` to be expandable

**REQUIREMENTS**

- [ ] Fixed Header and Footer on the top and bottom
- [ ] Adjustable Panels on the center
  - [ ] 5 panels
  - [ ] 1 ot them should be 2x large
  - [ ] other 4 panels should be same size
  - [ ] draggable and resizable
  - [ ] collapsible from panel to icon
  - [ ] expandable from icon to panel
  - [ ] scrollable inside panel

## Commands

### `npm start` or `yarn start`

Runs the app in the development mode.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm test` or `yarn test`

Launches the test runner in the interactive watch mode.

~~But no test now!~~

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Related Links

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

- [React documentation](https://reactjs.org/).
