# demo-adjustable-web

Demonstrate an adjustable web UI.

## COMMANDS

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

## STRUCTURE

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

- [x] Header and Footer
  - [x] Header has a fixed position on the top of the screen
  - [x] Footer also has a fixed position but on the bottom
- [x] 5 Adjustable Panels on the center
  - [x] a total of 5 panels
    - [x] 2 for show information
    - [x] 2 for menu, one is fixed and another is dynamic
    - [x] last is a larger one, for the conversation
  - [x] 4 panels in normal size, one is in large size
  - [x] scrollable inside panel
  - [x] draggable and re-sortable
  - [ ] tab bar for manage minimization and maximization
    - [ ] collapse from panel to tab bar
    - [ ] expand from tab bar to panel

## TODOs

- [x] Base on React > v16 with hooks
  - [x] Router
    - [x] Adjustable Web View on the root (/) path
    - [x] show a 404 message on other path
  - [x] Redux for data management
    - [x] configurations
    - [x] app's main state
    - [x] working flow with hooks api:
      - [x] `<Provider />` to wrap the app
      - [x] `useSelector` to get specific state
      - [x] `useDispatch` to get a despatcher
      - [x] use dispatcher to dispatch an action for state changes
  - [x] about CSS
    - [x] use sass as a CSS preprocessor
    - [x] ~~use less because of the customization of antd (cant work unless eject project)~~
    - [x] ~~use react-jss (cant work smoothly with typescript now)~~
- [x] Typescript
  - [x] override module's own definition in typings folder
  - [x] cast expressions to any type to suppress tiresome errors
- [x] Animation library - react-spring
  - [x] `useSprings` for animate a group of panels
  - [x] ~~Alternatives - react-motion (maybe not)~~
  - [x] ~~Alternatives - animated (perhaps not)~~
- [x] Topics - Debounce & Throttle for best performance
  - [x] debounce (used)
  - [x] throttle (used)
- [x] Thinking - How to layout? Flex or Table?
  - [x] absolute position for the most flexible
  - [x] flex box for other parts
  - [x] ~~table view is not recommended~~
- [x] Tool - UI Component Library for fast start
  - [x] antd
    - [x] components
    - [x] ~~layout (not need)~~

**Working Flow**

- [x] **[Phase 1 *Done*] Working Flow**
  - [x] build the basic workspace
    - [x] add some basic dependencies
    - [x] do some basic configs
  - [x] static version of the view
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
    - [x] action button
      - [x] bind start and stop actions to a single button
    - [x] pass a api key to start action
    - [x] pass a keywords list to start action
    - [x] send a callback to handle data changes
      - [x] get conversation body to display on the screen
      - [x] get a result keywords list and store it to the redux
    - [x] keep scrolling to the bottom if the scroll position is currently in the bottom
    - [x] simple backend for get access token
  - [x] Testing
    - [x] only part of reducer
    - [x] only part of utils

* [ ] **[Phase 2] Working Flow: For Tab Bar**
  - [ ] For now just implement the resizable and tab bar (2019/07/14)
    - [ ] Preparation
      - [ ] split resize handler by sortable flag
        - [ ] change width and height with a ratio in un-sortable mode
    - [ ] Turn to tab bar task
    - [ ] Resizable only in un-sortable mode
      - [x] resize icon
      - [ ] mouse key hold handler
      - [ ] change size
    - [ ] Add explanation
      - [ ] flag for display control of all explanations
  - [ ] Refactor the entire structure of the app to be clear
    - [ ] carding logic of each event
      - [ ] logic on resizing
        - [x] resizing if tab bar is appeared
          - [ ] a little bug with backup panels (will be fixed but not now)
      - [ ] logic on resetting
      - [ ] logic on resorting
      - [ ] logic on dragging
    - [ ] design the logic to meet the required new features
      - [ ] tab bar for collapse and expand panels
        - [ ] collapse button to minimize panel to the tab bar
        - [ ] maximize button to minimize other panels to the tab bar
          - [ ] set the target panel to be the max one and minimize other panels
        - [ ] retrieve panel from the tab bar to the main screen
      - [x] deal with z-index on operation on the tab bar
        - [x] set top z-index to the active tab/panel
          - [x] set top z-index in un-sortable mode
          - [x] set top z-index if tab is in active
            - [x] in un-sortable mode
        - [x] the z-index maybe should to be managed by a individual array
  - [ ] Add tab bar to the view
    - [x] basic tab bar placeholder
    - [ ] useTransitions to animate add and remove action
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
