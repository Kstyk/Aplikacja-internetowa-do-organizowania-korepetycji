import React from 'react'
import {
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaPython,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer
      id="footer"
      className="footer footer-center rounded-t-md border-t-[1px] border-t-gray-100 bg-base-100 p-10 text-base-content shadow-xl"
    >
      <nav className="grid grid-flow-col gap-4">
        <a className="link-hover link">O nas</a>
        <a className="link-hover link">Kontakt</a>
        <a className="link-hover link">Dojazd</a>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a>
            <FaTwitter className="h-7 w-7" />
          </a>
          <a href="https://github.com/Kstyk">
            <FaGithub className="h-7 w-7" />
          </a>
          <a>
            <FaYoutube className="h-7 w-7" />
          </a>
          <a>
            <FaFacebook className="h-7 w-7" />
          </a>
        </div>
      </nav>
      <aside>
        <p>Copyright © 2023 - Wszelkie prawa zastrzeżone - Seweryn Drąg</p>
      </aside>
    </footer>
  )
}

export default Footer
