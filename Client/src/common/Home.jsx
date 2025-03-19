import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  BarChart,
  Users,
  CreditCard,
  DollarSign,
  Bell,
  Smartphone,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
                F
              </div>
              <span className="text-xl font-bold text-blue-600">FinTrack</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                <a
                  href="#features"
                  className="text-gray-600 py-2 hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 py-2 hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  Testimonials
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 py-2 hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 py-2 hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  Contact
                </a>
                <div className="flex space-x-4 pt-2">
                  <Link
                    to="/signin"
                    className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-center w-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center w-full"
                  >
                    Sign Up
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Take Control of Your Finances
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                FinTrack helps individuals and businesses track expenses, manage
                vendors, and gain insights into spending habits in one simple
                platform.
              </p>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Get Started for Free
                <ChevronRight size={18} className="ml-2" />
              </Link>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img
                src="./iimg1.jpg"
                alt="FinTrack dashboard preview"
                className="rounded-xl bg-contain shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BarChart size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Categorization
              </h3>
              <p className="text-gray-600">
                Automatically organize your expenses into categories and
                subcategories for detailed analysis and reporting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Vendor Management
              </h3>
              <p className="text-gray-600">
                Keep track of all your vendors in one place, with complete
                contact information and transaction history.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multiple Accounts
              </h3>
              <p className="text-gray-600">
                Connect and manage all your financial accounts in one dashboard
                for a complete view of your finances.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Income Tracking
              </h3>
              <p className="text-gray-600">
                Track all your income sources alongside expenses to get a
                complete picture of your financial health.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Bell size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Alerts & Reminders
              </h3>
              <p className="text-gray-600">
                Set up customized alerts for budget limits, recurring expenses,
                and important financial deadlines.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mobile Access
              </h3>
              <p className="text-gray-600">
                Access your financial data anytime, anywhere with our responsive
                web application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-6 italic">
                &#34;FinTrack completely transformed how I manage my small
                business finances. The vendor tracking feature alone has saved
                me hours of work each month.&#34;
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
                  JD
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <p className="text-gray-600 text-sm">Small Business Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-6 italic">
                &#34;As someone who always struggled with budgeting, the
                categorization system in FinTrack finally helped me understand
                where my money was going.&#34;
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
                  JM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Jane Miller</h4>
                  <p className="text-gray-600 text-sm">Freelance Designer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-6 italic">
                &#34;The multi-account feature is exactly what I needed. Now I
                can see all my finances in one place without switching between
                different banking apps.&#34;
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
                  RL
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Robert Lee</h4>
                  <p className="text-gray-600 text-sm">Financial Advisor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Basic
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  Free
                </div>
                <div className="text-gray-600">Forever</div>
              </div>
              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {[
                    "Track up to 50 expenses monthly",
                    "Basic categorization",
                    "Single account management",
                    "Limited vendor tracking",
                    "Monthly summary reports",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/signup"
                className="text-blue-600 border border-blue-600 rounded-lg py-3 text-center hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-6 rounded-xl border border-blue-600 shadow-md md:transform md:scale-105 flex flex-col relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Professional
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  $9.99
                </div>
                <div className="text-gray-600">per month</div>
              </div>
              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {[
                    "Unlimited expense tracking",
                    "Advanced categorization",
                    "Multiple account management",
                    "Complete vendor management",
                    "Detailed analytics and reports",
                    "Recurring expenses",
                    "Budget alerts",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/signup"
                className="bg-blue-600 text-white rounded-lg py-3 text-center hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Business
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  $24.99
                </div>
                <div className="text-gray-600">per month</div>
              </div>
              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {[
                    "Everything in Professional",
                    "Multi-user access",
                    "Role-based permissions",
                    "API access",
                    "Custom categories",
                    "Accounting software integration",
                    "Dedicated support",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/contact"
                className="text-blue-600 border border-blue-600 rounded-lg py-3 text-center hover:bg-blue-50 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied users who have transformed their
            financial management with FinTrack.
          </p>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Sign Up Free Today
            <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
                  F
                </div>
                <span className="text-xl font-bold">FinTrack</span>
              </div>
              <p className="text-gray-400 mb-6">
                FinTrack is the smart expense management solution for
                individuals and businesses looking to take control of their
                finances.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FinTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
