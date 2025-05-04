import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaUserLock, FaDatabase } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center text-[#6C48E3] hover:text-[#5a3acf] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-[#6C48E3]">Room-Bazar</span> Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5F3FF] rounded-full mb-4">
              <FaShieldAlt className="text-[#6C48E3] text-2xl" />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains what personal data we collect and how we use it.
            </p>
          </div>

          <div className="prose prose-purple max-w-none">
            {/* Information Collection */}
            <section className="mb-10 p-6 bg-[#F5F3FF] rounded-lg">
              <div className="flex items-start">
                <FaUserLock className="text-[#6C48E3] text-xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">1. Information We Collect</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Personal Information:</strong> Name, email, phone number when you create an account</li>
                    <li><strong>Booking Details:</strong> Dates, payment information, special requests</li>
                    <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent on site</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">2. How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-[#EDE9FE]">
                  <h3 className="font-semibold text-[#6C48E3] mb-2">Service Provision</h3>
                  <p className="text-gray-700">To process bookings, manage your account, and provide customer support</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#EDE9FE]">
                  <h3 className="font-semibold text-[#6C48E3] mb-2">Communications</h3>
                  <p className="text-gray-700">To send booking confirmations, updates, and promotional offers (you can opt-out)</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#EDE9FE]">
                  <h3 className="font-semibold text-[#6C48E3] mb-2">Improvements</h3>
                  <p className="text-gray-700">To analyze usage patterns and improve our services</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#EDE9FE]">
                  <h3 className="font-semibold text-[#6C48E3] mb-2">Security</h3>
                  <p className="text-gray-700">To detect and prevent fraud or unauthorized activities</p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-10 p-6 bg-[#F5F3FF] rounded-lg">
              <div className="flex items-start">
                <FaDatabase className="text-[#6C48E3] text-xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">3. Data Sharing</h2>
                  <p className="text-gray-700 mb-4">We only share your data in these circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Hosts:</strong> Necessary booking details to fulfill your reservation</li>
                    <li><strong>Service Providers:</strong> Payment processors and IT service providers under strict confidentiality</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  </ul>
                  <p className="text-gray-700 mt-4">We never sell your personal information to third parties.</p>
                </div>
              </div>
            </section>

            {/* User Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">4. Your Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access, update or delete your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data in a portable format</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p>To exercise these rights, please contact us at <a href="mailto:privacy@roombazar.com" className="text-[#6C48E3] hover:underline">privacy@roombazar.com</a></p>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">5. Cookies & Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-[#EDE9FE] text-center">
                  <div className="text-[#6C48E3] font-medium">Essential</div>
                  <p className="text-sm text-gray-600">For site functionality</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#EDE9FE] text-center">
                  <div className="text-[#6C48E3] font-medium">Analytics</div>
                  <p className="text-sm text-gray-600">To understand usage</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#EDE9FE] text-center">
                  <div className="text-[#6C48E3] font-medium">Preferences</div>
                  <p className="text-sm text-gray-600">To remember settings</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                You can manage cookies through your browser settings. Disabling essential cookies may affect site functionality.
              </p>
            </section>

            {/* Policy Updates */}
            <section className="p-6 bg-[#F5F3FF] rounded-lg">
              <h2 className="text-2xl font-bold text-[#6C48E3] mb-4">6. Policy Updates</h2>
              <p className="text-gray-700">
                We may update this policy periodically. We'll notify you of significant changes via email or through our website. The "Last Updated" date below indicates when this policy was last revised.
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg inline-block">
                <p className="font-medium text-[#6C48E3]">Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Room-Bazar. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 space-x-6">
              <Link to="/legal/terms-and-conditions" className="text-gray-600 hover:text-[#6C48E3] text-sm">
                Terms of Service
              </Link>cd
              <Link to="/legal/privacy-policy" className="text-gray-600 hover:text-[#6C48E3] text-sm">
                Privacy Policy
              </Link>
              <a href="mailto:support@roombazar.com" className="text-gray-600 hover:text-[#6C48E3] text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;