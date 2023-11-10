import EditorJS from '@editorjs/editorjs';
import { Blocks } from '@editorjs/editorjs/types/api';
import { SavedData } from '@editorjs/editorjs/types/data-formats';
import { BlockToolData, ToolConfig } from '@editorjs/editorjs/types/tools';
type NewBlock = {
    type: string;
    data?: BlockToolData;
    config?: ToolConfig;
};
type BlockConverter = (shortcutText: string, blockType: string, blockText: string, blockData: SavedData | void) => NewBlock;
type BlockTypeComparator = (newBlockType: string, oldBlockType: string, oldBlockData: BlockToolData, newBlockData: BlockToolData) => boolean;
export type BlockConverterInfo = {
    shortcuts: (string | RegExp)[];
    enabledFor?: string[];
    converter: BlockConverter;
    blockTypeComparator?: BlockTypeComparator;
};
type BlockShortcutsConfig = {
    editor: EditorJS;
    blockConverters: BlockConverterInfo[];
    maxShortcutLength?: number;
};
export declare class BlockShortcuts {
    editor: EditorJS;
    blocks: Blocks;
    blockConverters: BlockConverterInfo[];
    maxShortcutLength: number;
    constructor({ editor, blockConverters, maxShortcutLength, }: BlockShortcutsConfig);
    addListeners(): void;
    private getConverterInfoByShortcut;
    private getCaretPosition;
    private defaultBlockTypeComparator;
    private static SPACES_REGEX;
}
export {};
