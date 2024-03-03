import React, { useCallback } from 'react'
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuAlignLeft,
  LuAlignRight,
  LuAlignCenter,
  LuAlignJustify,
  LuItalic,
  LuBold,
  LuUnderline,
  LuStrikethrough,
  LuSubscript,
  LuSuperscript,
  LuLink,
} from 'react-icons/lu'
import { ImEmbed } from 'react-icons/im'
import { BsTextParagraph } from 'react-icons/bs'
import { AiOutlineUnorderedList, AiOutlineOrderedList } from 'react-icons/ai'

const MenuBar = ({ editorComponent }) => {
  if (!editorComponent) {
    return null
  }
  const setLink = useCallback(() => {
    const previousUrl = editorComponent.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editorComponent.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    editorComponent
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }, [editorComponent])

  const addYoutubeVideo = () => {
    const url = prompt('Wprowadź link do filmu na YouTube')

    if (url) {
      editorComponent.commands.setYoutubeVideo({
        src: url,
        width: '100%',
      })
    }
  }

  const buttonClassActive =
    'flex flex-row justify-center min-w-[10%] items-center tooltip normal-case max-[300px]:w-1/6 bg-base-400 text-white active:bg-custom-darkgreen font-bold uppercase text-xs px-2 py-2 shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150'

  const buttonClass =
    'flex flex-row justify-center min-w-[10%]  items-center tooltip normal-case max-[300px]:w-1/6 bg-slate-200 text-custom-darkgreen active:bg-white font-bold uppercase text-xs px-2 py-2 shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 border-none'

  return (
    <div className="flex w-full flex-row flex-wrap justify-start">
      <button
        type="button"
        data-tip="Nagłówek pierwszego stopnia"
        onClick={() =>
          editorComponent.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={`${
          editorComponent.isActive('heading', { level: 1 })
            ? buttonClassActive
            : buttonClass
        }`}
      >
        <LuHeading1 className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Nagłówek drugiego stopnia"
        onClick={() =>
          editorComponent.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={
          editorComponent.isActive('heading', { level: 2 })
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuHeading2 className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Nagłówek trzeciego stopnia"
        onClick={() =>
          editorComponent.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={
          editorComponent.isActive('heading', { level: 3 })
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuHeading3 className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Paragraf"
        onClick={() => editorComponent.chain().focus().setParagraph().run()}
        className={
          editorComponent.isActive('paragraph')
            ? buttonClassActive
            : buttonClass
        }
      >
        <BsTextParagraph className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Pogrubienie"
        onClick={() => editorComponent.chain().focus().toggleBold().run()}
        className={
          editorComponent.isActive('bold') ? buttonClassActive : buttonClass
        }
      >
        <LuBold className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Kursywa"
        onClick={() => editorComponent.chain().focus().toggleItalic().run()}
        className={
          editorComponent.isActive('italic') ? buttonClassActive : buttonClass
        }
      >
        <LuItalic className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Podkreślenie"
        onClick={() => editorComponent.chain().focus().toggleUnderline().run()}
        className={
          editorComponent.isActive('underline')
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuUnderline className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Przekreślenie"
        onClick={() => editorComponent.chain().focus().toggleStrike().run()}
        className={
          editorComponent.isActive('strike') ? buttonClassActive : buttonClass
        }
      >
        <LuStrikethrough className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Indeks górny"
        onClick={() =>
          editorComponent.chain().focus().toggleSuperscript().run()
        }
        className={
          editorComponent.isActive('superscript')
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuSuperscript className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Indeks dolny"
        onClick={() => editorComponent.chain().focus().toggleSubscript().run()}
        className={
          editorComponent.isActive('subscript')
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuSubscript className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Link"
        onClick={() => setLink()}
        className={
          editorComponent.isActive('link') ? buttonClassActive : buttonClass
        }
      >
        <LuLink className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Wideo"
        onClick={() => addYoutubeVideo()}
        className={
          editorComponent.isActive('youtube') ? buttonClassActive : buttonClass
        }
      >
        <ImEmbed className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Lista nieponumerowana"
        onClick={() => editorComponent.chain().focus().toggleBulletList().run()}
        className={
          editorComponent.isActive('bulletList')
            ? buttonClassActive
            : buttonClass
        }
      >
        <AiOutlineUnorderedList className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Lista ponumerowana"
        onClick={() =>
          editorComponent.chain().focus().toggleOrderedList().run()
        }
        className={
          editorComponent.isActive('orderedList')
            ? buttonClassActive
            : buttonClass
        }
      >
        {' '}
        <AiOutlineOrderedList className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Wyrównianie do lewej"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign('left').run()
        }
        className={
          editorComponent.isActive({ textAlign: 'left' })
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuAlignLeft className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Wyśrodkowanie"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign('center').run()
        }
        className={
          editorComponent.isActive({ textAlign: 'center' })
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuAlignCenter className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Wyrównanie do prawej"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign('right').run()
        }
        className={
          editorComponent.isActive({ textAlign: 'right' })
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuAlignRight className="h-4 w-4 font-bold" />
      </button>
      <button
        type="button"
        data-tip="Wyjustowanie"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign('justify').run()
        }
        className={
          editorComponent.isActive({ textAlign: 'justify' })
            ? buttonClassActive
            : buttonClass
        }
      >
        <LuAlignJustify className="h-4 w-4 font-bold" />
      </button>
    </div>
  )
}

export default MenuBar
