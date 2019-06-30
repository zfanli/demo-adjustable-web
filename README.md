# demo-adjustable-web

Demonstrate an adjustable web UI.

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
    [DIR] tests - testing for reducer and utils
    [DIR] typings - override of type definitions
    actions.ts - action creators for reducer
    App.tsx - for manage route of entire app
    config.json - for configure app
    index.tsx - the entry of app
    store.ts - for manage sate of entire app
    type.ts - for common type interfaces
    utils.ts - for handle main events
    ...
  .env - customize env variable
  ...
```

## REQUIREMENTS

- [x] Fixed Header and Footer on the top and bottom
- [x] Adjustable Panels on the center
  - [x] 5 panels
  - [x] 1 of them should be 2x large
  - [x] other 4 panels should be the same size
  - [x] scrollable inside panel
  - [x] draggable and re-sortable
  - [ ] collapsible from panel to icon
  - [ ] expandable from icon to panel

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
  - [x] debounce (used)
  - [x] throttle (used)
- [x] Thinking - How to layout? Flex or Table?
  - [x] ~~maybe table view because rowspan can merge cells across line~~
  - [x] ~~but flex is more flexible to layout~~
  - [x] layout with absolute position
- [x] Tool - UI Component Library for fast start
  - [x] antd
    - [x] ~~layout (not used)~~
    - [x] components few used
- [x] **[Phase 1 *Done*] Working Flow**
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
  - [x] add interaction to it
    - [x] refactor `Panel` to be draggable
      - [x] ~~try without gesture hook, just handle on mouse down events, faster with gesture~~
      - [x] if cannot work, use gesture instead (done)
    - [x] refactor `Panel` to be sortable
      - [x] refactor to move gestures into container
        - [x] move gestures into container
        - [x] adjust resize actions
      - [x] refactor to add `order` for hold order
        - [x] added
      - [x] define order algorithms
        - [x] change direction first, row -> column, for further sort
        - [x] refactor position getter function to meet position changes
        - [x] algorithms for calculate index(position) change
        - [x] get position by new order
        - [x] resort caused by the largest panel is special
          - [x] do not allow small panel to resort to larger panel
          - [x] resort of larger panel map position to some patterns
        - [x] ~~retrieve order from cookie (not needed now)~~
  - [x] Styles UI
    - [x] base styles after draggable done
    - [x] fill fake data
      - [x] reply info is scrollable
      - [x] fill user info
    - [x] improve UI after sortable done
  - [x] Menu
    - [x] switch between sortable view and not sortable view
    - [x] display languages (en or jp)
    - [x] reset panels' position when un-sortable
  - [x] Speech to Text API
    - [x] start bind to button
    - [x] need to pass a keywords array
    - [x] and a api key to start
    - [x] send a callback to handle data changes
    - [x] get an object as parameter contains conversation and keyword feedback
    - [x] stop bind to button (the same with start handler, it will stop automatically)
    - [x] keep scrolling to bottom when scroll bar is currently in the bottom
    - [x] simple backend for get access token
  - [x] Testing
    - [x] only part of reducer
    - [x] only part of utils
- [ ] **[Phase 2] Working Flow: For Tab Bar**
  - [ ] Refactor the entire structure of the app to be clear
    - [ ] carding logic of each event
      - [ ] logic on resizing
      - [ ] logic on resetting
      - [ ] logic on resorting
      - [ ] logic on dragging
    - [ ] design the logic to meet the required new features
      - [ ] tab bar for collapse and expand panels
        - [ ] collapse button to minimize panel to the tab bar
        - [ ] maximize button to minimize other panels to the tab bar
          - [ ] set the target panel to be the max one and minimize other panels
        - [ ] retrieve panel from the tab bar to the main screen
      - [ ] deal with z-index on operation on the tab bar
        - [ ] set top z-index to the active tab/panel
        - [ ] the z-index maybe should to be managed by a individual array
  - [ ] Add tab bar to the view
    - [ ] panels minimize to tab bar
    - [ ] retrieve panels from tab bar
  - [ ] Fill fixed menu with 6 items
  - [ ] Dynamic add/remove items to dynamic menu according to the result keywords of watson speech
    - [ ] adding/removing items dynamically by the spotted times of keywords
    - [ ] keep only five items on the screen
    - [ ] transition animation when items changes
  - [ ] Reconsideration
    - [ ] Maybe remove `order` and animate with `useTransitions` instead of `useSprings`
    - [ ] resizable panels
  - [ ] Testing
    - [ ] improvement

**UI Logic**

- Main UI
  - Sortable View
    - order by column direction, means if col 1 row 1 is empty, col 1 row 2 will replace it
    - panel will not change its position if no resort action is triggered
      - temporary position changes during mouse gesture (dragging)
      - return to the previous position if no resort action is triggered
    - panel will resort if a valid resort action is triggered
      - also temporary position changes before dragging is done
      - a resort action will update all panels' position
      - animation will be triggered after a resort action
      - the panel which is moving will not go to its new position immediately
      - if no other resort action is triggered, moving panel will go to the new position after dragging done
    - while resort, normal size panel will not effect the position of the larger size panel
      - resort action caused by a normal size panel will only resort between normal size panels
      - if the largest one is in the middle, it is also no effect to resort between normal panels
      - the resort between normal panels will around the largest one if it is in the middle
    - while resort, larger size panel only move by col (col 1~3)
      - the largest one has only three valid position, by col numbers, 1~3
      - even mouse could moving to the second row, position changes will happening by col only
    - if a backup of un-sortable panels exists, it will be used while switch to un-sortable view
    - if no backup exists, switch to un-sortable mode will cause nothing
  - Un-Sortable View
    - panel's position will change at dragging
    - switch to sortable view will cause a reset of each panel's position to previous status
    - [NOTE!] relationship of layers is not implemented because the big different between sortable and un-sortable mode
    - [NOTE!] it could be implemented but might make a damage change to sortable view
  - Settings
    - language changes between English and Japanese
    - sortable mode switch
    - position reset

## Related Links

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

- [React documentation](https://reactjs.org/).
