![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Block shortcut feature for Editor.js (like in Notion)

Basic text Tool for the [Editor.js](https://ifmo.su/editor).

## Installation

Get the package

```shell
npm install editorjs-block-shortcut
```
## Usage

To convert some block

Minimal configuration:

```javascript
import BlockShortcuts from 'editorjs-block-shortcut';
const Header = require('@editorjs/header');

const blockConverters = {
    shortcut: '#',
    converter: (text) => ({
        type: 'header',
        data: {
            text: '',
            level: 1,
        },
        config: null,
    }),
}

const editor = new EditorJS({
    tools: {
        header: Header,
    },
    onReady: () => {
        new BlockShortcuts({ editor });
    },
});
```

If a user input '#' and press space in 

### Ex

```javascript
import BlockShortcuts from 'editorjs-block-shortcut';
const Header = require('@editorjs/header');

const blockConverters = {
    shortcut: /[#]{1,6}}/,
        converter: (text) => ({
    type: 'header',
    data: {
        text: ,
        level: text.length,
    },
    config: null,
},
}

const editor = new EditorJS({
    tools: {
        header: Header,
    }
    onReady: () => {
        new BlockShortcuts({ editor });
    },
});
```

## Config Params

The Paragraph Tool supports these configuration parameters:

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| placeholder | `string` | The placeholder. Will be shown only in the first paragraph when the whole editor is empty.  |
| preserveBlank | `boolean` | (default: `false`) Whether or not to keep blank paragraphs when saving editor data |

## Output data

| Field  | Type     | Description      |
| ------ | -------- | ---------------- |
| text   | `string` | paragraph's text |


```json
{
    "type" : "paragraph",
    "data" : {
        "text" : "Check out our projects on a <a href=\"https://github.com/codex-team\">GitHub page</a>.",
    }
}
```
