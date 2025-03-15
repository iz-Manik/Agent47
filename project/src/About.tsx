import { useState, useEffect } from 'react';
import { Newspaper, Shield, Clock, ArrowRight, Github, ExternalLink, BarChart, Code, Sparkles } from 'lucide-react';

const AboutSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Our advanced system uses natural language processing to intelligently process and summarize articles automatically.",
      icon: <Sparkles className="w-12 h-12 text-blue-500" />
    },
    {
      title: "Fact Checking",
      description: "We verify claims using trusted fact-checking sources and APIs to ensure information accuracy.",
      icon: <Shield className="w-12 h-12 text-green-500" />
    },
    {
      title: "Real-Time Updates",
      description: "Our system refreshes every 30 minutes to bring you the latest news and developments.",
      icon: <Clock className="w-12 h-12 text-purple-500" />
    },
    {
      title: "Data Visualization",
      description: "Complex information is presented through intuitive charts and graphs for better understanding.",
      icon: <BarChart className="w-12 h-12 text-orange-500" />
    },
    {
      title: "Open Source",
      description: "Our platform is built with transparency in mind - the code is available for anyone to review and contribute to.",
      icon: <Code className="w-12 h-12 text-red-500" />
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-16">
      <div className={`max-w-7xl mx-auto px-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="flex justify-center items-center mb-4">
            <Newspaper className="w-10 h-10 mr-2 text-blue-400" />
            <h1 className="text-5xl font-extrabold tracking-tight">Trump<span className="text-blue-400">Tracker</span> AI</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            An intelligent news aggregation platform that automatically collects, analyzes, and fact-checks news articles
            related to Donald Trump. Using advanced AI and natural language processing, the platform filters through the noise
            of political coverage to deliver verified information and identify disputed claims.
          </p>
        </div>

        {/* Interactive Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-gray-800 bg-opacity-50 rounded-2xl p-6 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">Key Features</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center ${activeFeature === index ? 'bg-blue-900 bg-opacity-50 shadow-lg shadow-blue-900/30' : 'hover:bg-gray-700'}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="mr-4 opacity-70">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{feature.title}</h3>
                  </div>
                  {activeFeature === index && (
                    <ArrowRight className="w-5 h-5 ml-auto text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="h-full bg-gray-800 bg-opacity-30 rounded-2xl p-10 backdrop-blur flex flex-col justify-center">
              <div className="flex justify-start mb-6">
                {features[activeFeature].icon}
              </div>
              <h2 className="text-3xl font-bold mb-4">{features[activeFeature].title}</h2>
              <p className="text-xl text-gray-300 mb-8">{features[activeFeature].description}</p>

              <div className="mt-auto pt-8 border-t border-gray-700">
                <div className="flex space-x-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${activeFeature === index ? 'w-10 bg-blue-500' : 'w-6 bg-gray-600'}`}
                      onClick={() => setActiveFeature(index)}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800 bg-opacity-30 rounded-2xl p-8 text-center backdrop-blur transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-lg text-gray-300">Continuous Monitoring</div>
          </div>
          <div className="bg-gray-800 bg-opacity-30 rounded-2xl p-8 text-center backdrop-blur transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold text-blue-400 mb-2">99%</div>
            <div className="text-lg text-gray-300">Fact Check Accuracy</div>
          </div>
          <div className="bg-gray-800 bg-opacity-30 rounded-2xl p-8 text-center backdrop-blur transform hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold text-blue-400 mb-2">5K+</div>
            <div className="text-lg text-gray-300">Articles Analyzed Daily</div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">TrumpTracker AI © 2025</p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <ExternalLink className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;