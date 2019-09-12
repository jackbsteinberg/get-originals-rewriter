import { createElement as Document_createElement } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
import { remove as Element_remove } from "std:global/Element";
import { document_get as Window_document_get } from "std:global/Window";
import { isConnected_get as Node_isConnected_get } from "std:global/Node";
const elt = Reflect_apply(Document_createElement, Window_document_get(), ['div']);
Reflect_apply(Element_remove, elt, []);
const conn = Reflect_apply(Node_isConnected_get, elt);
