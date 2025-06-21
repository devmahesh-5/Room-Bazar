import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../index';

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-[#F2F4F7]">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-between">
          {/* Logo */}
          <div className="w-full p-6 md:w-1/2 lg:w-5/12 hidden md:block">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
                <span className="ml-2 text-2xl font-bold text-[#6C48E3]">
                  Room Bazar
                </span>
              </div>
             
            </div>
          </div>


          {/* Legal and contact Section */}
          <div className="w-full p-6 md:w-1/2 lg:w-4/12 justify-center">
            
            <ul className="list-none flex flex-row justify-between space-x-8">
              <li className="mb-3">
                <a href="mailto:roombazar25@gmail.com" className="text-base font-medium text-[#2C2C2C] hover:text-[#6C48E3]">
                Mail
              </a>
              </li>
              <li className="mb-3">
                <Link className="text-base font-medium text-[#2C2C2C] hover:text-[#6C48E3]" to="/legal/terms-and-conditions">
                  Terms & Conditions
                </Link>
              </li>
              <li className="mb-3">
                <Link className="text-base font-medium text-[#2C2C2C] hover:text-[#6C48E3]" to="/legal/privacy-policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-base font-medium text-[#2C2C2C] hover:text-[#6C48E3]" to="/">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
         <p className="text-sm text-[#2C2C2C] text-opacity-80 text-center">
                &copy; Copyright 2025. All Rights Reserved by Room Bazar.
              </p>
      </div>
    </section>
  );
}

export default Footer;