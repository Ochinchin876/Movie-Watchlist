import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiNetlify } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
      <aside className="grid-flow-col items-center">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          className="fill-current"
        >
          <path d="M22.672 15.226l-2.432.811..."></path>
        </svg>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="w-5 h-5 hover:text-white" />
        </a>
        <a
          href="https://www.linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="w-5 h-5 hover:text-white" />
        </a>
        <a
          href="https://yourproject.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiNetlify className="w-5 h-5 hover:text-white" />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
