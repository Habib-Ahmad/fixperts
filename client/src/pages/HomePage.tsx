import logo from '@/assets/logo.svg';
import star from '@/assets/star.svg';
import clean from '@/assets/clean.svg';
import floor from '@/assets/floor.svg';
import move from '@/assets/move.svg';
import outlet from '@/assets/outlet.svg';
import paint from '@/assets/paint.svg';
import repair from '@/assets/repair.svg';
import spanner from '@/assets/spanner.svg';
import trash from '@/assets/trash.svg';
import { Button, Input } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';

const services = [
  {
    name: 'House Cleaning',
    icon: clean,
    key: 'cleaning',
  },
  {
    name: 'Handyman',
    icon: spanner,
    key: 'handyman',
  },
  {
    name: 'Electrical repair',
    icon: outlet,
    key: 'electrical',
  },
  {
    name: 'Painting',
    icon: paint,
    key: 'painting',
  },
  {
    name: 'Waste Removal',
    icon: trash,
    key: 'waste',
  },
  {
    name: 'Local Moving',
    icon: move,
    key: 'moving',
  },
  {
    name: 'HVAC',
    icon: floor,
    key: 'hvac',
  },
  {
    name: 'Appliance Repair',
    icon: repair,
    key: 'appliance',
  },
];

const reviews = [
  {
    name: 'Aisha',
    text: 'Fixperts helped me find a plumber in 15 minutes. 10/10!',
  },
  {
    name: 'Emmanuel',
    text: 'I signed up as a pro and started getting clients immediately.',
  },
  {
    name: 'Sarah',
    text: 'Clean, easy to use, and reliable. Highly recommend!',
  },
  {
    name: 'John',
    text: 'Great experience! Found a great electrician in no time.',
  },
  {
    name: 'Mary',
    text: 'The app is user-friendly and the service was top-notch.',
  },
];

const HomePage = () => {
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  const [sliderRef] = useKeenSlider({
    mode: 'free',
    defaultAnimation: {
      duration: 500,
      easing: (t) => t,
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 32 },
      },
    },
  });

  return (
    <main>
      <section className="px-[5vw] sm:px-[10vw] text-center pt-6">
        <img src={logo} alt="Logo" className="h-10 w-10 mx-auto mb-4" />
        <h1 className="text-3xl sm:text-5xl font-extrabold">
          Get price estimates for every <br /> home project.
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center mt-6 gap-4 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search for services"
            className="w-full px-4 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button className="px-4 h-12" onClick={() => navigate(`/services/?key=${query}`)}>
            Search
          </Button>
        </div>
        <p className="text-gray-500 text-sm font-semibold mt-4 flex items-center justify-center gap-1 flex-wrap">
          <span>Trusted by 4.5M+ people • 4.9/5</span>
          <img src={star} alt="star" className="w-4 h-4 inline-block" />
          <span>with over 300k reviews on the App Store</span>
        </p>
      </section>

      <section>
        <div className="mt-20 border-b-1 border-gray-200">
          <img
            src="https://production-next-images-cdn.thumbtack.com/i/543007802831609867/width/1366.webp"
            alt="Showcase"
            className="mx-auto object-cover"
          />
        </div>
      </section>

      <section className="px-[5vw] sm:px-[10vw] py-16 text-center w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6">Popular Services</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.name}
              to={`/services/?key=${service.key}`}
              className="bg-white rounded-lg px-4 py-8 grid place-items-center border shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
            >
              <img src={service.icon} alt={service.name} className="w-6 h-6 mb-2" />
              <h3 className="font-bold">{service.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-[5vw] sm:px-[10vw] flex flex-col md:flex-row items-center justify-center gap-16 mx-auto py-16 border-t-1 border-gray-200">
        <img
          src="https://production-next-images-cdn.thumbtack.com/i/452733542057811980/width/320.png"
          alt="Showcase"
          className=""
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">Open for business</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of professionals earning more <br /> on their own terms.
          </p>
          <Button size="lg">Become a Fixpert pro</Button>
        </div>
      </section>

      <section className="px-[5vw] sm:px-[10vw] py-16 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">What our users are saying</h2>

        <div ref={sliderRef} className="keen-slider">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="keen-slider__slide bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-left"
            >
              <p className="text-sm text-gray-700">"{review.text}"</p>
              <p className="text-xs text-gray-500 mt-3">— {review.name}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
