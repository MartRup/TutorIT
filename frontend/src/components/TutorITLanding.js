import { Link } from 'react-router-dom';
import Header from './Header';

const TutorITLanding = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* Navbar */}
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Peer-Powered Learning, <br />
          <span className="text-blue-600">Affordably.</span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          TutorIT connects you with top-performing student peers for easy, flexible, and affordable study support.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-blue-200 transition">
            Find You Peer Tutor
          </button>
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold shadow-sm transition">
            Start Earning Extra Cash
          </button>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Get the Help You Need</h2>
          <p className="text-gray-600">Search thousands of vetted peer tutors by subject, grade level, and availability.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="e.g., Calculus, Organic Chemistry, History 101"
                className="w-full p-4 pl-4 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold transition flex items-center justify-center gap-2">
              Search Tutors
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
            <span className="text-gray-600 mr-2">Popular:</span>
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-blue-300">Math</span>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-green-300">Science</span>
            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-purple-300">Writing</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-yellow-200">Programming</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-4">Affordable Rates</h3>
            <p className="text-gray-600 leading-relaxed">
              Peer tutors offer great value, making high-quality help accessible without breaking the bank.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-4">Relatable Peers</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn from students who recently aced the exact same course you're struggling with.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-4">Flexible Scheduling</h3>
            <p className="text-gray-600 leading-relaxed">
              Easily find times that fit your busy student schedule, day or night.
            </p>
          </div>
        </div>
      </section>

      {/* Become a Tutor Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Share Your Knowledge, Earn Extra Income
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Are you a top student in your courses? Turn your knowledge into cash with TutorIT's flexible tutoring jobs.
            </p>
            <ul className="space-y-4 mb-8 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">• **Simple Setup:**</span>
                Get verified quickly and set your own profile.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">• **Total Flexibility:**</span>
                Tutor whenever you have a free hour between classes or on weekends.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">• **Weekly Pay:**</span>
                Earn money based on your self-set rates and get paid consistently.
              </li>
            </ul>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition">
              Apply to be a Tutor Today
            </button>
          </div>

          <div className="flex justify-center">
            {/* Placeholder for the student image - using a gray placeholder for generic use */}
            <div className="w-full max-w-md h-80 bg-gray-300 rounded-xl overflow-hidden shadow-lg relative">
              {/* In a real app, use an <img> tag here */}
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Smiling Student Tutor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blue CTA Section */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Boost Your Grades or Your Wallet?
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Join the TutorIT community and simplify your student life.
        </p>
        <button className="bg-white text-blue-900 hover:bg-gray-100 px-10 py-3 rounded-lg font-bold shadow-lg transition">
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-16 px-6 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="text-2xl font-bold tracking-tight mb-4">
              <span className="text-blue-500">Tutor</span>
              <span className="text-green-500">IT</span>
            </div>
            <p className="text-slate-400">Peer learning, simplified.</p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            {/* Note: Image had 'Company' twice, usually this is 'Support' */}
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            {/* Note: Image had 'Company' thrice, usually this is 'Legal' */}
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Legal of Services</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center border-t border-slate-800 pt-8">
          <p>© 2025 TutorIT. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default TutorITLanding;
