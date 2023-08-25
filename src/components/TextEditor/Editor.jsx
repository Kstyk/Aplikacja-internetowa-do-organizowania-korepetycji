import React, { useEffect, useState, forwardRef } from "react";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Heading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import "./styles.scss";

const Editor = forwardRef((props, ref) => {
  const { fieldName, setValue, fieldValue, setValueHtml } = props;
  const [content, setContent] = useState(fieldValue);
  const [contentHtml, setContentHtml] = useState(fieldValue);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "w-full block rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-700 sm:text-sm sm:leading-6 min-h-[250px] max-h-[250px] overflow-auto",
      },
    },
    extensions: [
      Underline,
      Subscript,
      Superscript,
      TextStyle.configure({ types: [ListItem.name] }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-[square] pl-6",
          },
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6",
          },
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      Heading.configure({ levels: [1, 2, 3] }).extend({
        levels: [1, 2, 3],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes = {
            1: "text-3xl",
            2: "text-2xl",
            3: "text-xl",
          };
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }),
    ],
    content: fieldValue,
    onUpdate({ editor }) {
      setContent(editor.getText());
      setContentHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    setValue(fieldName, content != null ? content.trim() : content);
    setValueHtml(contentHtml);
  }, [content, contentHtml]);

  useEffect(() => {
    setValue(fieldName, fieldValue);
    setContentHtml(fieldValue);
  }, []);

  return (
    <div ref={ref}>
      <MenuBar editorComponent={editor} />
      <EditorContent editor={editor} className="max-h-[280px]" />
    </div>
  );
});

export default Editor;
