import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#132026] text-gray-300 w-full">
      {/* Padded Content */}
      <div className="px-6 md:px-16 lg:px-36">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between w-full gap-10 border-b border-gray-500 pb-14">
          {/* Logo + Description */}
          <div className="md:max-w-96 flex flex-col items-center text-center">
            <p className="text-sm mt-10">
              TEM is a task management application designed to help users track their tasks and performance efficiently.
              It provides a user-friendly interface for managing tasks, monitoring progress, and enhancing productivity.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center md:items-center justify-center md:justify-end gap-10 md:gap-40 text-center md:text-left">
            <div className="mt-10 max-md:mt-0">
              <h2 className="font-semibold mb-5 text-white">Get in touch</h2>
              <div className="text-sm space-y-2">
                <p className="hover:text-white cursor-default">+91 6389841527</p>
                <p className="hover:text-white cursor-default">agraharirishabh40204@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Footer Bottom Bar */}
      <div className="w-full bg-[#0B1418]">
        <p className="pt-4 text-center text-sm text-gray-400 pb-5">
          © {new Date().getFullYear()} TRACK EVERY MOMENT. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
