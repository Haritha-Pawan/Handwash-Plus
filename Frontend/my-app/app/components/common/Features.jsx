import { features } from '../../constance/costance';
import { Card } from '../ui/card';

export function Features() {


  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Why Choose <span className="text-cyan-600">CleanHands</span>?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive tools and features designed to promote and maintain excellent handwashing practices in your school
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 hover:shadow-xl transition-shadow border-gray-200 bg-white"
          >
            <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
