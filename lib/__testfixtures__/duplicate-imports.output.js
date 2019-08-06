import Document, { createElement as Document_createElement, createTextNode as Document_createTextNode } from "std:global/Document";
import { call } from "std:global/Reflect";
const a = new Document();
const b = new Document();
const c = call(a, Document_createElement, ['div']);
const d = call(b, Document_createTextNode, ['test']);
