import { SavedData } from '@editorjs/editorjs/types/data-formats'
import { BlockToolData } from '@editorjs/editorjs/types/tools'
import { BlockConverterInfo } from '../src/block-shortcut'

export const editorJsBlockShortcuts: BlockConverterInfo[] = [
    {
        shortcuts: ['-', '*'],
        enabledFor: ['paragraph', 'checklist'],
        converter: (
            shortcutText: string,
            blockType: string,
            blockText: string,
            blockData: SavedData,
        ) => {
            let items
            if (blockType == 'checklist') {
                items = blockData.data.items.map(item => ({ content: item.text }))
            } else {
                items = [{ content: blockText, items: [] }]
            }
            return {
                type: 'list',
                data: {
                    style: 'unordered',
                    items,
                },
                config: null,
            }
        },
    },
    {
        shortcuts: [/^\d+[.]/],
        enabledFor: ['paragraph', 'checklist'],
        converter: () => ({
            type: 'list',
            data: {
                style: 'ordered',
                items: [{ content: '', items: [] }],
            },
            config: null,
        }),
    },
    {
        shortcuts: ['[]'],
        enabledFor: ['paragraph', 'list'],
        converter: (
            shortcutText: string,
            blockType: string,
            blockText: string,
            blockData: SavedData,
        ) => {
            let items
            if (blockType == 'list') {
                const getChildText = (items) => {
                    if (!items) {
                        return ''
                    }
                    return items.map(item => item.content + getChildText(item.items)).join(' ')
                }
                items = blockData.data.items.map(item => ({
                    text: `${item.content} ${getChildText(item.items)}`
                }))
            } else {
                items = [{ text: blockData.data.text }]
            }
            return {
                type: 'checklist',
                data: {
                    style: 'unordered',
                    items: items,
                },
                config: null,
            }
        },
    },
    {
        shortcuts: [/[#]{1,6}/],
        enabledFor: ['paragraph', 'header', 'list', 'checklist'],
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
            blockType: string,
            blockText: string,
            blockData: SavedData,
        ) => ({
            type: 'header',
            data: {
                text: blockData.data.text,
                level: shortcutText.length,
            },
            config: null,
        }),
    },
    {
        shortcuts: ['<>'],
        enabledFor: ['paragraph'],
        converter: () => ({
            type: 'code',
            data: {
                text: '',
            },
            config: null,
        }),
    },
    {
        shortcuts: ['***'],
        enabledFor: ['paragraph'],
        converter: () => ({
            type: 'delimeter',
            data: {},
            config: null,
        }),
    },
    {
        shortcuts: ['|'],
        enabledFor: ['paragraph'],
        converter: () => ({
            type: 'quote',
            data: {
                text: ''
            },
            config: null,
        }),
    },
    {
        shortcuts: ['|||'],
        enabledFor: ['paragraph'],
        converter: () => ({
            type: 'table',
            data: {
                text: ''
            },
            config: null,
        }),
    },
]
