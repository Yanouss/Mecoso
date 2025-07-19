import React from 'react'

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface Feature166Props {
  heading: string;
  description?: string;
  feature1: Feature;
  feature2: Feature;
  feature3: Feature;
  feature4: Feature;
  feature5: Feature;
  feature6: Feature;
}

const Services = ({
  heading = "Our Construction Services",
  description = "We deliver reliable, innovative, and tailored construction solutions across every stage of your project.",
  feature1 = {
    title: "Architectural Design",
    description:
      "Bringing your vision to life with modern, sustainable, and client-focused architectural plans.",
    image: "images/service1.jpg",
  },
  feature2 = {
    title: "Project Management",
    description:
      "Ensuring timely delivery and cost efficiency through effective planning and supervision.",
    image: "images/service2.jpg",
  },
  feature3 = {
    title: "Structural Engineering",
    description:
      "Designing robust, safe, and code-compliant structures that stand the test of time.",
    image: "images/service3.jpg",
  },
  feature4 = {
    title: "Heavy Machinery & Logistics",
    description:
      "Utilizing modern equipment and expert logistics to streamline construction operations.",
    image: "images/service4.jpg",
  },
  feature5 = {
    title: "Quality Assurance",
    description:
      "Rigorous testing and inspection protocols ensuring excellence at every project phase.",
    image: "images/service5.jpg",
  },
  feature6 = {
    title: "Green Building Solutions",
    description:
      "Sustainable construction practices and eco-friendly materials for a better future.",
    image: "images/service6.jpg",
  },
}: Feature166Props) => {
  const features = [feature1, feature2, feature3, feature4, feature5, feature6];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
      
      <div className="container px-6 mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            What We Do
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Feature 1 - Large Hero Card */}
          <div className="md:col-span-6 lg:col-span-8 row-span-2 group">
            <div className="relative h-full min-h-[500px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={features[0].image}
                alt={features[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                <div className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  01
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  {features[0].title}
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  {features[0].description}
                </p>
              
              </div>
            </div>
          </div>

          {/* Feature 2 - Small Card */}
          <div className="md:col-span-3 lg:col-span-4 group">
            <div className="relative h-full min-h-[240px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={features[1].image}
                alt={features[1].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  02
                </div>
                <h2 className="text-lg font-bold mb-2">
                  {features[1].title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  {features[1].description}
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 - Small Card */}
          <div className="md:col-span-3 lg:col-span-4 group">
            <div className="relative h-full min-h-[240px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={features[2].image}
                alt={features[2].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  03
                </div>
                <h2 className="text-lg font-bold mb-2">
                  {features[2].title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  {features[2].description}
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 - Medium Card */}
          <div className="md:col-span-3 lg:col-span-6 group">
            <div className="relative h-full min-h-[300px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={features[3].image}
                alt={features[3].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  04
                </div>
                <h2 className="text-xl font-bold mb-3">
                  {features[3].title}
                </h2>
                <p className="text-white/90 leading-relaxed">
                  {features[3].description}
                </p>
              </div>
            </div>
          </div>

          {/* Feature 5 - Medium Card */}
          <div className="md:col-span-3 lg:col-span-3 group">
            <div className="relative h-full min-h-[300px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={features[4].image}
                alt={features[4].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  05
                </div>
                <h2 className="text-lg font-bold mb-3">
                  {features[4].title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  {features[4].description}
                </p>
              </div>
            </div>
          </div>

          {/* Feature 6 - Medium Card */}
          <div className="md:col-span-6 lg:col-span-3 group">
            <div className="relative h-full min-h-[300px] bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={features[5].image}
                alt={features[5].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  06
                </div>
                <h2 className="text-lg font-bold mb-3">
                  {features[5].title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  {features[5].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <button className="px-8 py-4 bg-[#fcbd0f] text-white rounded-2xl font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
            Start Your Project
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Services