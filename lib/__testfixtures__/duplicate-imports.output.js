import Document, { createElement as Document_createElement, createTextNode as Document_createTextNode } from "std:global/Document";
import { call as Reflect_call } from "std:global/Reflect";
const a = new Document();
const b = new Document();
const c = Reflect_call(a, Document_createElement, ['div']);
const d = Reflect_call(b, Document_createTextNode, ['test']);
