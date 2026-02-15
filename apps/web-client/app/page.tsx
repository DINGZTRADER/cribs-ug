export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-extrabold tracking-tight">
                  UGANDA<span className="text-brand-green">HOMES</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Property Finder
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
              <a href="#" className="hover:text-brand-green transition-colors">
                Rentals
              </a>
              <a href="#" className="hover:text-brand-green transition-colors">
                For Sale
              </a>
              <a href="#" className="hover:text-brand-green transition-colors">
                Land
              </a>
              <a href="#" className="hover:text-brand-green transition-colors">
                Commercial
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-700 font-semibold px-4 py-2">
                Log In
              </button>
              <button className="bg-brand-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors">
                List Property
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-16 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Find your next home in{" "}
              <span className="text-brand-green">Uganda</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Verified listings across Kampala, Entebbe, Jinja and all major
              districts.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="relative flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="material-symbols-outlined text-gray-400 mr-2">
                    home
                  </span>
                  <select className="bg-transparent border-none focus:ring-0 w-full font-semibold text-gray-700 outline-none">
                    <option>For Rent</option>
                    <option>For Sale</option>
                  </select>
                </div>
                <div className="relative flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="material-symbols-outlined text-gray-400 mr-2">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="Location (e.g. Kampala)"
                    className="bg-transparent border-none focus:ring-0 w-full font-semibold text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </div>
                <div className="relative flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="material-symbols-outlined text-gray-400 mr-2">
                    payments
                  </span>
                  <select className="bg-transparent border-none focus:ring-0 w-full font-semibold text-gray-700 outline-none">
                    <option>Max Price (UGX)</option>
                    <option>500k - 1M</option>
                    <option>1M - 3M</option>
                    <option>3M - 10M</option>
                  </select>
                </div>
                <button className="bg-brand-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">search</span>
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Featured Properties
              </h2>
              <p className="text-gray-500 mt-2">
                Latest listings in popular residential areas.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  filter_list
                </span>{" "}
                Filters
              </button>
              <select className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-semibold outline-none focus:ring-0">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="relative h-64">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB81-0yl8Pvi95csQVtfPTZsOGDEZUvPAi5o9_msvoLJfKWS49gO3PbPim8GEGAqF_UygX1pk3b65RZrjF9POUqaYwSglyHEKOEE26fUp421-R803teTxmxRrdlsT9Q6csuN7cKVTZnO_6-rw6WwAN_NDzzLLTQuP2qh6u132MvK7sN-er-dr8hrIfYZYWG8-TfYLJUBG67XOiAHJ0YJ4WIbayaDLU07nqx8Opl5lya6e0SrR8uhVUnoSlq15QZR2fNvPHbCOt1akU"
                  alt="Modern Apartment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded">
                  FEATURED
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold text-brand-dark">
                  UGX 2,500,000 / mo
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-gray-900">
                  Modern 3 Bedroom Apartment
                </h3>
                <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
                  <span className="material-symbols-outlined text-base text-brand-green">
                    location_on
                  </span>
                  Nakasero, Kampala
                </p>
                <div className="flex items-center gap-4 text-gray-600 mb-6 border-y border-gray-50 py-3">
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      bed
                    </span>{" "}
                    3
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      bathtub
                    </span>{" "}
                    2
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      garage
                    </span>{" "}
                    1
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gray-100 text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">
                      call
                    </span>{" "}
                    Call
                  </button>
                  <button className="btn-whatsapp py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-lg">
                      chat
                    </span>{" "}
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="relative h-64">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLOyxqq3dQQGpBTp-EK5gN1i8f6JoMOl04aHsNE-Bd1EGF_cRDwDaM9UQvlzIRBFuD_B6nCoGvbzJXyTwbGPDMRdrGbIHioUHn1glEPZaMLUHk2QD5Y_WPBgnl1CVrjfJu4u26eJ4VpSEqR4CG20np3Fk7n0r1VvLWaDJF1WatqHnz2vjBppUwW89XbBfZqhvJM_ELjokmLU9sv85pd_NpcRnQtdmn_cwklYyGhLHIQCrfbTZj9MzIxrhxjsRaq_IHIbe0sbNIUY"
                  alt="Cozy Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">
                  RENTED SOON
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold text-brand-dark">
                  UGX 850,000 / mo
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-gray-900">
                  Cozy Studio with Balcony
                </h3>
                <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
                  <span className="material-symbols-outlined text-base text-brand-green">
                    location_on
                  </span>
                  Kira Road, Kampala
                </p>
                <div className="flex items-center gap-4 text-gray-600 mb-6 border-y border-gray-50 py-3">
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      bed
                    </span>{" "}
                    1
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      bathtub
                    </span>{" "}
                    1
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      wifi
                    </span>{" "}
                    Included
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gray-100 text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">
                      call
                    </span>{" "}
                    Call
                  </button>
                  <button className="btn-whatsapp py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-lg">
                      chat
                    </span>{" "}
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="relative h-64">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvh4uV1ySc-idfGK50baMVRzmdI0vsivKFP2p-HNWnUWDnUqgytDJYqwTMKd1NzCgSZkh43OojR7gMQGVsj-_gl-srGf1EIiIHYeq1-FVyulkAF1VCnguo00Kh4Dq7rMAVlmnF1DBVPYE4w_FljP_JWn0k99NcNJaUfOvoXL3QmJVvPeGdd7CuLEea_lz4CDF1qHYX2ySPdtQ4aup_78kWBXXP2lCRw7dndd6m3a6_aNoDcF6Ie7TQdKRFXCoBXujk1lM_X5780c0"
                  alt="Executive Villa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded">
                  FOR SALE
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold text-brand-dark">
                  UGX 450,000,000
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-gray-900">
                  Executive Villa with Lake View
                </h3>
                <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
                  <span className="material-symbols-outlined text-base text-brand-green">
                    location_on
                  </span>
                  Lubowa, Entebbe Road
                </p>
                <div className="flex items-center gap-4 text-gray-600 mb-6 border-y border-gray-50 py-3">
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      bed
                    </span>{" "}
                    5
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      bathtub
                    </span>{" "}
                    4
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      square_foot
                    </span>{" "}
                    3,500 sqft
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gray-100 text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">
                      call
                    </span>{" "}
                    Call
                  </button>
                  <button className="btn-whatsapp py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-lg">
                      chat
                    </span>{" "}
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button className="bg-white border-2 border-brand-dark text-brand-dark px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-dark hover:text-white transition-all">
              Load More Properties
            </button>
          </div>
        </section>

        {/* Popular Locations */}
        <section className="bg-gray-100 py-20 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold mb-10 text-center text-gray-900">
              Popular Locations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Kampala Central", count: "1,240 listings" },
                { name: "Entebbe", count: "450 listings" },
                { name: "Ntinda", count: "820 listings" },
                { name: "Kiwatule", count: "310 listings" },
                { name: "Buziga", count: "215 listings" },
                { name: "Mukono", count: "540 listings" },
              ].map((loc) => (
                <a
                  key={loc.name}
                  href="#"
                  className="bg-white p-6 rounded-xl text-center border border-transparent hover:border-brand-green transition-all shadow-sm"
                >
                  <p className="font-bold text-gray-900">{loc.name}</p>
                  <p className="text-sm text-gray-500">{loc.count}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-extrabold tracking-tight text-white mb-6 block">
                UGANDA<span className="text-brand-green">HOMES</span>
              </span>
              <p className="text-sm leading-relaxed">
                The simplest way to find rentals and houses for sale in Uganda.
                No brokers, no hidden fees, just direct access to property
                owners.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    How to post ads
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Pricing for Landlords
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Districts</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Kampala
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Wakiso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Jinja
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-green transition-colors"
                  >
                    Mbarara
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">
                Subscribe to Alerts
              </h4>
              <p className="text-xs mb-4">
                Get new listings in your inbox weekly.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-800 border-none rounded-l-lg w-full text-sm p-3 outline-none focus:ring-1 focus:ring-brand-green"
                />
                <button className="bg-brand-green text-white px-4 py-2 rounded-r-lg font-bold text-sm">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2024 Uganda Property Finder. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
