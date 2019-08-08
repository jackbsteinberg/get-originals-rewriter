import Document, { createElement as Document_createElement, createTextNode as Document_createTextNode } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
const a = new Document();
const b = new Document();
const c = Reflect_apply(a, Document_createElement, ['div']);
const c2 = Reflect_apply(a, Document_createElement, ['div']);
const d = Reflect_apply(b, Document_createTextNode, ['test']);
