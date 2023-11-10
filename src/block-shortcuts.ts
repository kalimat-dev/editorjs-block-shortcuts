import EditorJS from '@editorjs/editorjs'
import { Blocks } from '@editorjs/editorjs/types/api'
import { BlockAPI } from '@editorjs/editorjs/types/api/block'
import { SavedData } from '@editorjs/editorjs/types/data-formats'
import { BlockToolData, ToolConfig } from '@editorjs/editorjs/types/tools'

type NewBlock = {
    type: string
    data?: BlockToolData
    config?: ToolConfig
}

type BlockConverter = (
    shortcutText: string,
    oldBlockType: string,
    oldBlockData: SavedData | void,
) => NewBlock

type BlockTypeComparator = (
    newBlockType: string,
    oldBlockType: string,
    oldBlockData: BlockToolData,
    newBlockData: BlockToolData,
) => boolean

export type BlockConverterInfo = {
    shortcuts: (string | RegExp)[]
    converter: BlockConverter
    enabledFor?: string[]
    blockTypeComparator?: BlockTypeComparator
}

type BlockShortcutsConfig = {
    editor: EditorJS
    blockConverters: BlockConverterInfo[]
    maxShortcutLength?: number
}

export class BlockShortcuts {

    editor: EditorJS
    blocks: Blocks
    blockConverters: BlockConverterInfo[]
    maxShortcutLength: number

    constructor({
        editor,
        blockConverters,
        maxShortcutLength,
    }: BlockShortcutsConfig) {
        this.editor = editor
        this.blocks = editor.blocks
        this.blockConverters = blockConverters
        this.maxShortcutLength = maxShortcutLength ?? 10
        this.addListeners()
    }

    addListeners() {
        const redactor = document.querySelector('.codex-editor__redactor')
        redactor!!.addEventListener('keyup', (e: any) => {
            if (e.code === 'Space') {
                const currentBlockIndex = this.blocks.getCurrentBlockIndex()
                const block: BlockAPI = this.blocks.getBlockByIndex(currentBlockIndex)!!
                const blockDomElement = block!!.holder
                const blockText = blockDomElement.innerText

                const caretPosition = this.getCaretPosition()
                // prevent comparing long texts to not affect the editor efficiency
                if (caretPosition > this.maxShortcutLength) {
                    return
                }

                //copy from start to caret position excluding last space symbol
                const shortcutText = blockText.substr(0, caretPosition - 1).trim()

                // skip shortcut action if the text already contains spaces
                if (BlockShortcuts.SPACES_REGEX.test(shortcutText)) {
                    return
                }

                const converterInfo = this.getConverterInfoByShortcut(block.name, shortcutText)
                if (converterInfo) {
                    //remove shortcut with space
                    document.activeElement.innerHTML = document.activeElement.innerHTML
                        .replace(shortcutText, '')
                        .replace(/(&nbsp;| )/, '');
                    (async() => {
                        const oldBlockData = await block.save()
                        const newBlock = converterInfo.converter(
                            shortcutText,
                            block.name,
                            oldBlockData,
                        )

                        const comparator = converterInfo.blockTypeComparator || this.defaultBlockTypeComparator
                        if (
                            !comparator(
                                newBlock.type,
                                block.name,
                                (oldBlockData as SavedData).data,
                                newBlock.data
                            )
                        ) {
                            return
                        }

                        this.blocks.delete(currentBlockIndex)
                        this.blocks.insert(
                            newBlock.type,
                            newBlock.data,
                            newBlock.config,
                            currentBlockIndex,
                            true
                        )
                        this.editor.caret.setToBlock(currentBlockIndex)
                    })()
                }
            }
        })
    }

    private getConverterInfoByShortcut(
        currentBlockType: string,
        shortcutText: string
    ): BlockConverterInfo | null {
        return this.blockConverters.find((converter) => {
            const matches = converter.shortcuts.some((shortcut) => {
                if (shortcut instanceof RegExp && shortcut.test(shortcutText)) {
                    return true
                } else if (shortcut == shortcutText) {
                    return true
                }
                return false
            })

            if (!matches) {
                return false
            }

            if (!converter.enabledFor) {
                return true
            }

            return converter.enabledFor.includes(currentBlockType)
        })
    }

    private getCaretPosition() {
        document.execCommand('insertHTML', false, '<a id="hidden">&#x200e</a>')
        const hiddenNode = document.getElementById('hidden')
        if (!hiddenNode) {
            return 0
        }
        const caretPosition = hiddenNode.parentElement.innerText.indexOf('\u200e')
        hiddenNode.parentNode.removeChild(hiddenNode)
        return caretPosition
    }

    private defaultBlockTypeComparator(
        newBlockType: string,
        oldBlockType: string,
    ): boolean {
        return newBlockType != oldBlockType
    }

    private static SPACES_REGEX = /^\s+$/
}
