import Image from 'next/image';
import { MapPin, BarChart2, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <div className="relative bg-dark overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-dark-hover sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10  mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left py-5">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-light sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Streamline your fleet</span>{' '}
                  <span className="block text-primaryaccent xl:inline">with MyGarage</span>
                </h1>
                <p className="mt-3 text-base text-gray-muted sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Optimize your fleet operations, reduce costs, and improve efficiency with our intelligent fleet management solution.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link 
                      href="/pages/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-light bg-primaryaccent hover:bg-dark-hover md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-dark-hover bg-gray-light hover:bg-gray-muted md:py-4 md:text-lg md:px-10"
                    >
                      Live demo
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-black/20">
          <Image
            className="h-56  w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/bg.jpg"
            alt="Fleet management dashboard"
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-dark" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primaryaccent font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-light sm:text-4xl">
              A better way to manage your fleet
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-muted lg:mx-auto">
              FleetMaster provides a comprehensive suite of tools to help you manage your fleet more efficiently.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-gray-light">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Real-time GPS Tracking</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Track your vehicles in real-time, optimize routes, and improve response times.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-gray-light">
                    <BarChart2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Advanced Analytics</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Gain insights into your fleet's performance with detailed reports and analytics.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-gray-light">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Maintenance Scheduling</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Automate maintenance schedules to keep your fleet in top condition and reduce downtime.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-gray-light">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Driver Safety Monitoring</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Monitor driver behavior and promote safe driving practices to reduce accidents and liability.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-dark-hover" id="testimonials">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-light sm:text-4xl">
            <span className="block">Trusted by fleet managers worldwide.</span>
            <span className="block">Start optimizing your fleet today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-muted g-gray-muted">
            "FleetMaster has revolutionized our fleet management process. We've seen a 30% reduction in fuel costs and a 25% increase in overall efficiency."
          </p>
          <p className="mt-2 text-base font-semibold text-gray-light">- John Doe, Fleet Manager at XYZ Logistics</p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-primaryaccent" id="pricing">
        <div className="pt-12 sm:pt-16 lg:pt-24">
          <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-2 lg:max-w-none">
              <h2 className="text-lg leading-6 font-semibold text-dark-border uppercase tracking-wider">Pricing</h2>
              <p className="text-3xl font-extrabold text-dark sm:text-4xl lg:text-5xl">
                The right price for your fleet
              </p>
              <p className="text-xl text-dark-border">
                Choose the perfect plan for your fleet size and needs.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-dark pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-primaryaccent"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
                <div className="flex-1 bg-dark px-6 py-8 lg:p-12">
                  <h3 className="text-2xl font-extrabold text-gray-light sm:text-3xl">Standard Plan</h3>
                  <p className="mt-6 text-base text-gray-light">
                    Perfect for small to medium-sized fleets looking to optimize their operations.
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <h4 className="flex-shrink-0 pr-4 bg-dark text-sm tracking-wider font-semibold uppercase text-primaryaccent">
                        What's included
                      </h4>
                      <div className="flex-1 border-t-2 border-dark-border"></div>
                    </div>
                    <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-primaryaccent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-light">Real-time GPS tracking</p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-primaryaccent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-light">Maintenance scheduling</p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-primaryaccent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-light">Basic analytics</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="py-8 px-6 text-center bg-gray-light sm:py-12 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-between lg:px-12">
                  <p className="text-base text-dark">
                    <span className="block text-4xl font-extrabold">$29</span>
                    <span className="text-sm font-medium text-dark-border">/mo</span>
                  </p>
                  <a
                    href="#"
                    className="mt-8 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-light bg-primaryaccent hover:bg-dark-hover"
                  >
                    Choose Plan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-dark" id="faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:text-center">
            <h2 className="text-base text-primaryaccent font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-light sm:text-4xl">
              Have questions? We've got answers.
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-muted lg:mx-auto">
              Check out our frequently asked questions to get quick answers to your queries.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="mt-10 max-w-3xl mx-auto">
            <details className="group border-b border-dark-border">
              <summary className="text-gray-light">
                What is FleetMaster?
              </summary>
              <p className="mt-2 text-gray-muted">
                FleetMaster is an intelligent fleet management solution that helps optimize fleet operations.
              </p>
            </details>

            <details className="group border-b border-dark-border">
              <summary className="text-gray-light">
                How does real-time GPS tracking work?
              </summary>
              <p className="mt-2 text-gray-muted">
                Our system provides real-time updates on vehicle locations and enables route optimization.
              </p>
            </details>

            <details className="group border-b border-dark-border">
              <summary className="text-gray-light">
                Is FleetMaster suitable for large fleets?
              </summary>
              <p className="mt-2 text-gray-muted">
                Yes, FleetMaster is designed to handle fleets of all sizes, from small to large.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
