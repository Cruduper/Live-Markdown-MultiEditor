## Fixes
- MultiEditor: style buttons for switching editors
- Remove debug console logs



## Bugs
- Input is not sanitized
- ProseMirrorEditor: can't display strikeout
- If you click on a editor button while that editor is already displayed, the active mode button stops being highlighted



## Upgrades Ideas
- Ability to save raw markdown text and then display it from backend (mocked?) request
- If the code is similar enough, can each editor component be populated programmatically from config files, making only a single MultiEditor component necessary? This is probably not real-world ideal, because you'd only be using editor in the real world, but it might make this project a little cleaner. 