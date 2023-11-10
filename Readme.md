<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)"  srcset="./assets/logo_night.png">
      <source media="(prefers-color-scheme: light)" srcset="./assets/logo_day.png">
      <img alt="Block Shortcuts Logo" src="./assets/logo_day.png">
    </picture>    
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/editorjs-block-shortcut">
    <img src="https://flat.badgen.net/npm/v/editorjs-block-shortcut?icon=npm" alt="npm"/>
  </a>
</p>

Block shortcut feature for Editor.js (like in Notion)

## Installation

Insall the package

```shell
npm install editorjs-block-shortcut
```

## Usage

Minimal configuration:

```typescript
import { BlockShortcuts } from 'editorjs-block-shortcut'
import Header from '@editorjs/header'

const blockConverters = [
    {
        shortcut: ['#'],
        converter: (shortcutText) => ({
            type: 'header',
            data: {
                text: '',
                level: 1,
            },
            config: null,
        }),
    }
]

const editor = new EditorJS({
    tools: {
        header: Header,
    },
    onReady: () => {
        new BlockShortcuts({ editor })
    },
});
```

If a user input '#' and press "Space" in the beginning some block it will be converted to the header block.

### Multiple shortcuts

You can specify multiple shortcuts:

```typescript
import { BlockShortcuts } from 'editorjs-block-shortcut'
import Header from '@editorjs/header'

const blockConverters = [
    {
        shortcuts: ['-', '*'],
        converter: (shortcutText) => ({
            type: 'list',
            data: {
                style: 'unordered',
                items: [],
            },
            config: null,
        }),
    }
]
```

### Regex shortcuts

The plugin also allows you to validate shortcuts using regular expressions. This can be useful, for example, in blocks
with different variations. Let's look at an example with headers:

```typescript
import { BlockShortcuts } from 'editorjs-block-shortcut'
import Header from '@editorjs/header'

const blockConverters = [
    {
        shortcut: [/[#]{1,6}}/],
        converter: (shortcutText) => ({
            type: 'header',
            data: {
                text: '',
                level: shortcutText.length,
            },
            config: null,
        })
    }
]
```

Now, when you enter # or ##, the block will be converted to block H1 or H2, respectively.

### Retrieving data from an old block

Sometimes it is necessary not only to convert one block into another, but also to preserve the data from the original
block. Below is an example of how to do this:

```typescript
import { SavedData } from '@editorjs/editorjs/types/data-formats'
import { BlockShortcuts } from 'editorjs-block-shortcut'
import Header from '@editorjs/header'

const blockConverters = [
    {
        shortcut: [/[#]{1,6}}/],
        converter: (
            shortcutText: string,
            oldBlockType: string,
            oldBlockData: SavedData | void,
        ) => ({
            type: 'header',
            data: {
                text: (oldBlockData as SavedData).data.text,
                level: shortcutText.length,
            },
            config: null,
        })
    }
]
```

### Enabling converting only for specific blocks

You can specify that the converter only works for certain blocks using the xxx option:

```typescript
import { BlockShortcuts } from 'editorjs-block-shortcut'
import Header from '@editorjs/header'

const blockConverters = [
    {
        shortcut: [/[#]{1,6}}/],
        enabledFor: ['paragraph'],
        converter: (shortcutText) => ({
            type: 'header',
            data: {
                text: '',
                level: shortcutText.length,
            },
            config: null,
        })
    }
]
```

By default, converters apply to all block types.

### Comparing blocks

Notion allows us to convert one heading level to another, but with the default configuration of the converter this will
not be possible. By default, the library compares the old and new block by type, and if the types are the same, then the
conversion will not occur.

To correct this behavior, you can specify your own block comparison function, which, in addition to the type, also
compares the header level:

```typescript
import { SavedData } from '@editorjs/editorjs/types/data-formats'
import { BlockShortcuts } from 'editorjs-block-shortcut'
import Header from '@editorjs/header'

const blockConverters = [
    {
        shortcut: [/[#]{1,6}}/],
        enabledFor: ['paragraph', 'header'],
        blockTypeComparator: (
            newBlockType: string,
            oldBlockType: string,
            oldBlockData: BlockToolData,
            newBlockData: BlockToolData,
        ) => {
            return newBlockType != oldBlockType || oldBlockData.level != newBlockData.level
        },
        converter: (
            shortcutText: string,
            oldBlockType: string,
            oldBlockData: SavedData | void,
        ) => ({
            type: 'header',
            data: {
                text: (oldBlockData as SavedData).data.text,
                level: shortcutText.length,
            },
            config: null,
        })
    }
]
```

## Config Params

Converter config supports the options (* - required option):

| Field               | Type     | Description        |
|---------------------|----------| ------------------ |
| shortcuts *         | <code>(string &#124; RegExp)[]</code> | |
| converter *         | `BlockConverter` | |
| enabledFor          | `string[]` | |
| blockTypeComparator | `BlockTypeComparator` | |
