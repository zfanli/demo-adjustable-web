# demo-adjustable-web

Demonstrate an adjustable web UI.

## TODOs

- [x] Base on React > v16
  - [x] use typescript
    - [x] you can override a module's own definition by declare it in typings folder
    - [x] cast to any type if some tiresome errors is ocurred
  - [x] router for cover other situations
  - [x] redux for integrate configurations
    - [x] read data (Provider and connect)
    - [x] dispatch actions
  - [x] JSS? Or other CSS preprocessor?
    - [x] ~~follow antd to use less as css preprocessor (cannot use less until eject...)~~
    - [x] use sass instead ~~(for common definition)~~
    - [x] ~~use react-jss for normally use (cannot work smoothly with typescript now)~~
- [x] Animation library - react-spring
  - [x] basic usage for recall
  - [x] ~~Alternatives - react-motion (maybe not)~~
  - [x] ~~Alternatives - animated (perhaps not)~~
- [x] Topics - Debounce & Throttle for best performance
  - [x] debounce (only usage)
  - [x] throttle (usage only)
- [x] Thinking - How to layout? Flex or Table?
  - [x] ~~maybe table view because rowspan can merge cells across line~~
  - [x] ~~but flex is more flexible to layout~~
  - [x] layout with absolute position
- [ ] Tool - UI Component Library for fast start
  - [ ] antd
    - [ ] layout
    - [ ] components
- [ ] Working Flow
  - [x] build workspace
    - [x] dependencies
    - [x] base configs
  - [x] statics version web
    - [x] `Header` component just a placeholder
    - [x] `Content` component for layout, actually named `AdjustableView`
    - [x] `Footer` component just a placeholder
    - [x] `Panel` component also just a placeholder
    - [x] extract configs to file
    - [x] loading configs to redux store
  - [ ] add interaction to it
    - [x] refactor `Panel` to be draggable
      - [x] ~~try without gesture hook, just handle on mouse down events, faster with gesture~~
      - [x] if cannot work, use gesture instead (done)
    - [ ] refactor `Panel` to be sortable
      - [x] refactor to move gestures into container
        - [x] move gestures into container
        - [x] adjust resize actions
      - [ ] define order algorithms
        - [x] change direction first, row -> column, for further sort
        - [ ] refactor position getter function to meet position changes
        - [ ] algorithms for calculate index(position) change
        - [ ] retrieve order from cookie
    - [ ] refactor `Panel` to be resizable
    - [ ] refactor `Panel` to be collapsible
    - [ ] refactor `Panel` to be expandable
  - [ ] Styles UI
    - [ ] base styles after draggable done
    - [ ] fill fake data
      - [ ] fixed menu has only 6 items
      - [ ] dynamic menu has 5
      - [ ] reply info is scrollable
    - [ ] improve UI after sortable done
  - [ ] Menu
    - [x] switch between sortable view and not sortable view
    - [x] display languages (en or jp)
    - [x] reset panels' position when un-sortable
    - [ ] other settings
  - [ ] Speech to Text API
    - [ ] start bind to button
    - [ ] need to pass a keywords array
    - [ ] and a api key to start
    - [ ] send a callback to handle data changes
    - [ ] get an object as parameter contains conversation and keyword feedback
    - [ ] stop bind to button

**REQUIREMENTS**

- [x] Fixed Header and Footer on the top and bottom
- [ ] Adjustable Panels on the center
  - [x] 5 panels
  - [x] 1 of them should be 2x large
  - [x] other 4 panels should be the same size
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

## Structure

```text
Root
  [DIR] public - for public resources
  [DIR] src - for sources
    [DIR] components - for all components
    [DIR] css - for all css resources
    [DIR] locales - for localize strings
    [DIR] views - for layouts
    App.tsx - for manage route of entire app
    config.json - for configure app
    index.tsx - the entry of app
    store.ts - for manage sate of entire app
    type.ts - for common type interfaces
  .env - customize env variable
  ...
```

## Related Links

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

- [React documentation](https://reactjs.org/).
