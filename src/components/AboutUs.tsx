import React from 'react';
import { Award, Users, Clock, Shield, MapPin } from 'lucide-react';
import ServiceAreaMap from './ServiceAreaMap';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Melrose Mobile Restrooms</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Dedicated to providing luxury mobile restroom solutions that elevate every event experience.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded with a vision to revolutionize the mobile restroom rental industry, 
              Melrose Mobile Restrooms has been setting new standards in luxury and service excellence. 
              We understand that your special event deserves nothing less than perfection, which is why 
              we've dedicated ourselves to providing premium mobile facilities that match the elegance 
              of your occasion.
            </p>
          </div>

          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              Our commitment goes beyond just providing clean facilities. We believe in creating an 
              experience that seamlessly integrates with your event, allowing your guests to feel 
              comfortable and cared for throughout your celebration. Every detail, from our 
              climate-controlled interiors to our professional maintenance service, is designed 
              with your event's success in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for perfection in every aspect of our service, from equipment to customer care.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Service</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We go above and beyond to exceed expectations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
              <p className="text-gray-600">
                Count on us for timely delivery, professional setup, and dependable service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">
                Premium materials, luxury finishes, and meticulous maintenance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment to You</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Our experienced team of professionals understands the importance of your special day. 
            We work tirelessly behind the scenes to ensure that every detail is perfect, so you 
            can focus on what matters most - celebrating with your loved ones.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            From weddings and corporate events to festivals and family gatherings, we've had the 
            privilege of being part of countless memorable moments. Let us help make your next 
            event extraordinary with our luxury mobile restroom solutions.
          </p>
        </div>
      </section>

      {/* Service Area Map */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Area</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We proudly serve the Greater Boston Area and surrounding communities.
              The map below shows our approximate service radius.
            </p>
          </div>
          <ServiceAreaMap />
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Not sure if we serve your area? Contact us and we'll be happy to help!
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-red-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8">
            Contact us today to discuss how we can make your event exceptional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+14693554659"
              className="bg-white text-red-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Call (469) 355-4659
            </a>
            <a
              href="mailto:info@melrosemobilerestrooms.com"
              className="border-2 border-white text-white hover:bg-white hover:text-red-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;