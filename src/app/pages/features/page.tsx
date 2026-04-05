import Image from 'next/image'
import { MapPin, BarChart2, Clock, Shield, Zap, DollarSign } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <div className="relative bg-dark overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-dark-border sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-light sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Powerful features for</span>{' '}
                  <span className="block text-primaryaccent xl:inline">efficient fleet management</span>
                </h1>
                <p className="mt-3 text-base text-gray-muted sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto">
                  Discover how FleetMaster can revolutionize your fleet operations with our comprehensive suite of features.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/bg2.jpg"
            alt="Fleet management dashboard"
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primaryaccent font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-light sm:text-4xl">
              Everything you need to manage your fleet
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-muted lg:mx-auto">
              FleetMaster provides a comprehensive suite of tools to help you manage your fleet more efficiently.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-dark">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Real-time GPS Tracking</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Track your vehicles in real-time, optimize routes, and improve response times. Our advanced GPS tracking system provides accurate location data and helps you make informed decisions.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-dark">
                    <BarChart2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Advanced Analytics</p>
                </dt>
                <div className="mt-2 ml-16 text-base text-gray-muted">
                  Gain insights into your fleets performance with detailed reports and analytics. Analyze fuel consumption, driver behavior, vehicle utilization, and more to optimize your operations.
                </div>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-dark">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Maintenance Scheduling</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Automate maintenance schedules to keep your fleet in top condition and reduce downtime. Set up reminders for regular check-ups, track maintenance history, and manage vehicle health efficiently.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-dark">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Driver Safety Monitoring</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Monitor driver behavior and promote safe driving practices to reduce accidents and liability. Track speeding, harsh braking, and other safety metrics to improve overall fleet safety.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-dark">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Fuel Management</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Optimize fuel consumption and reduce costs with our advanced fuel management system. Track fuel usage, identify inefficiencies, and implement strategies to improve fuel economy across your fleet.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primaryaccent text-dark">
                    <DollarSign className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-light">Cost Tracking and Reporting</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-muted">
                  Keep track of all fleet-related expenses and generate comprehensive reports. Monitor costs associated with fuel, maintenance, repairs, and more to identify areas for potential savings.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-dark-hover">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-light sm:text-4xl">
            <span className="block">Ready to optimize your fleet?</span>
            <span className="block text-primaryaccent">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-dark bg-primaryaccent hover:bg-opacity-90"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primaryaccent bg-dark hover:bg-dark-hover"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
