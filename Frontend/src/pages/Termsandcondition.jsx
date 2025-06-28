import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-[#6C48E3] hover:text-[#5a3acf] transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="ml-6 text-3xl font-bold text-gray-900">
            Room-Bazar <span className="text-[#6C48E3]">Terms & Conditions</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          <div className="prose prose-purple max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">1. General Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Room-Bazar, you accept and agree to be bound by these Terms and Conditions.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {/* <li>You must be at least 18 years old to use our services</li> */}
                <li>All information provided must be accurate and current</li>
                {/* <li>You are responsible for maintaining the confidentiality of your account</li> */}
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">2. Booking Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong className="text-[#6C48E3]">Reservations:</strong> All bookings are subject to availability and confirmation.
                </p>
                <p>
                  <strong className="text-[#6C48E3]">Payments:</strong> Full payment may be required at the time of booking unless otherwise specified.
                </p>
                <p>
                  <strong className="text-[#6C48E3]">Cancellations:</strong> There is no refund policy for cancellations for now.
                </p>
                {/* <p>
                  <strong className="text-[#6C48E3]">Check-in:</strong> Room booked by user gets auto check-in after 24 hours if not checked in by user and room will never be available.
                </p> */}
                <p>
                  <strong className="text-[#6C48E3]">Access Restrictions:</strong> You may not access the main profile of user but can access other Roommate Profile.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">3. User Responsibilities</h2>
              <div className="bg-[#F5F3FF] p-4 rounded-lg border border-[#DDD6FE]">
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Treat all properties with respect and care</li>
                  <li>Comply with all house rules provided by hosts</li>
                  <li>Report any damages immediately</li>
                  <li>No illegal activities permitted on the premises</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">4. Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our separate <Link to="/legal/privacy-policy" className="text-[#6C48E3] hover:underline">Privacy Policy</Link> which explains how we collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">5. Changes to Terms</h2>
              <p className="text-gray-700">
                Room-Bazar reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
              <div className="mt-6 p-4 bg-[#F5F3FF] rounded-lg">
                <p className="font-medium text-[#6C48E3]">Last Updated: {'6/28/2025'}</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Have questions?</h3>
            <p className="mt-2 text-gray-600">
              Contact us at <a href="mailto:goroombazar@gmail.com" className="text-[#6C48E3] hover:underline">support@roombazar.com</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Room-Bazar. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;