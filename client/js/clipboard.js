"use strict";

const $ = require("jquery");

function copyMessages(event) {
	const selection = window.getSelection();

	// If selection does not span multiple elements, do nothing
	if (selection.anchorNode === selection.focusNode) {
		return;
	}

	const copyLines = [];
	const range = selection.getRangeAt(0);
	const documentFragment = range.cloneContents();
	let messages = documentFragment.querySelectorAll(".msg");

	// If selection is a single line
	if (messages.length === 0) {
		messages = [documentFragment];
	}

	messages.forEach((message) => {
		message = $(message);

		const time = getCleanText(message.find(".time")).trim();
		const from = getCleanText(message.find(".from .user")).trim();
		const text = getCleanText(message.find(".content")).trim();

		if (!from.length && !time.length && !text.length) {
			copyLines.push(getCleanText(message));
		} else if (from.length > 0) {
			copyLines.push(`${time} <${from}> ${text}`);
		} else {
			copyLines.push(`${time} ${text}`);
		}
	});

	// Whatever we did went wrong
	if (copyLines.length === 0) {
		return;
	}

	const copyText = copyLines.join("\n");

	(event.originalEvent.clipboardData || window.clipboardData).setData("Text", copyText);
	event.preventDefault();
}

function getCleanText(element) {
	let text = "";
	element.contents().each((_, node) => {
		if (node.nodeType === Node.ELEMENT_NODE) {
			text += getCleanText($(node));
		} else if (node.nodeType === Node.TEXT_NODE) {
			if (!/\S/.test(node.nodeValue)) {
				text += " ";
			} else {
				text += node.textContent.replace(/\n/g, " ");
			}
		}
	});

	return text;
}

$("#chat").on("copy", ".messages", copyMessages);
