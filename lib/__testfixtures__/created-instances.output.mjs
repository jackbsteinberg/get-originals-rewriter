import Document, { createElement as Document_createElement } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
import { setAttribute as HTMLDivElement_setAttribute, remove as HTMLDivElement_remove } from "std:global/HTMLDivElement";
const d = new Document();
/**
 * @type {HTMLDivElement}
 */
const elt = Reflect_apply(Document_createElement, d, ['div']);
Reflect_apply(HTMLDivElement_setAttribute, elt, ['color', 'blue']);
Reflect_apply(HTMLDivElement_remove, elt, []);
