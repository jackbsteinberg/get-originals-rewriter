import Document, { createElement as Document_createElement } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
import { setAttribute as HTMLDivElement_setAttribute, remove as HTMLDivElement_remove, attributes_get as HTMLDivElement_attributes_get } from "std:global/HTMLDivElement";
import { length_get as NamedNodeMap_length_get } from "std:global/NamedNodeMap";
const d = new Document();
const elt = Reflect_apply(Document_createElement, d, ['div']);
Reflect_apply(HTMLDivElement_setAttribute, elt, ['color', 'blue']);
Reflect_apply(HTMLDivElement_remove, elt, []);
const atts = Reflect_apply(HTMLDivElement_attributes_get, elt);
Reflect_apply(NamedNodeMap_length_get, atts);
