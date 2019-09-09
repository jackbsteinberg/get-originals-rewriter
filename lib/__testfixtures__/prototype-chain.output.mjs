import { createElement as Document_createElement } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
import { remove as ChildNode_remove } from "std:global/ChildNode";
import { document_get as Window_document_get } from "std:global/Window";
const elt = Reflect_apply(Document_createElement, Window_document_get(), ['div']);
Reflect_apply(ChildNode_remove, elt, []);
