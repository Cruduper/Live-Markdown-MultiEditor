## Fixes
- Fix component function names for each editor
- Decrease hardcoding in editor components with config file/s
- Increase consistency between files:
  - state variable names
  - coding conventions/code shape
- MultiEditor: style buttons for switching editors
- Remove debug console logs



## Bugs
- Input is not sanitized
- ProseMirrorEditor: state update bug when typing into text input field
- ProseMirrorEditor: can't display strikeout
- If you click on a editor button while that editor is already displayed, the active mode button stops being highlighted



## Upgrades Ideas
- Ability to save raw markdown text and then display it from backend (mocked?) request
- If the code is similar enough, can each editor component be populated programmatically from config files, making only a single MultiEditor component necessary? This is probably not real-world ideal, because you'd only be using editor in the real world, but it might make this project a little cleaner. 