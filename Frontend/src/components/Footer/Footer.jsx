import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../index';

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-[#F2F4F7]">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
              </div>
              <div>
                <p className="text-sm text-[#2C2C2C]">
                  &copy; Copyright 2025. All Rights Reserved by Mahesh Bhandari.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[#2C2C2C]">
                Tent Sewing Enterprises
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Features
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Pricing
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[#2C2C2C]">
                Contact Us
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Facebook
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Whatsapp
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[#2C2C2C]">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-[#2C2C2C] hover:text-[#4CAF50]"
                    to="/"
                  >
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;

