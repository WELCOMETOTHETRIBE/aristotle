import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Target, Sparkles, ArrowRight, Play, Mic, Zap, Shield } from 'lucide-react';

const quotes = [
  "The unexamined life is not worth living. - Socrates",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
  "The only true wisdom is in knowing you know nothing. - Socrates",
  "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
  "The mind is everything. What you think you become. - Buddha",
];

const features = [
  {
    icon: <Mic className="h-8 w-8" />,
    title: "Voice-First Design",
    description: "Natural conversations with your AI coach through voice input and output",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Evolving Memory",
    description: "AI that remembers your values, preferences, and learns from every interaction",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Structured Plans",
    description: "Concrete, actionable steps to help you achieve your goals and flourish",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Hedonic Awareness",
    description: "Monitor patterns and triggers to break unhealthy habits and build better ones",
    color: "from-orange-500 to-red-500",
  },
];

const benefits = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Aristotle-Inspired",
    description: "Built on ancient wisdom for modern flourishing",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-Time Processing",
    description: "Instant voice transcription and AI responses",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy-First",
    description: "Your data stays private and secure",
  },
];

export default function HomePage() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Quote */}
            <div className="mb-8">
              <blockquote className="text-xl md:text-2xl font-medium text-muted-foreground italic">
                "{randomQuote}"
              </blockquote>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Become who you are, intentionally.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Your Aristotle-inspired voice-first personal assistant for flourishing, 
              wellness, and intentional living.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                <Link href="/onboarding">
                  <Play className="h-5 w-5 mr-2" />
                  Begin Your Journey
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
                <Link href="/coach">
                  <Mic className="h-5 w-5 mr-2" />
                  Try Voice Chat
                </Link>
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Personal Life Coach
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Aion combines ancient wisdom with modern AI to help you build better habits, 
              achieve your goals, and live a more intentional life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to start your journey toward intentional living
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Share Your Story</h3>
              <p className="text-muted-foreground">
                Tell Aion about your values, goals, and challenges through voice conversation
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Personalized Plans</h3>
              <p className="text-muted-foreground">
                Receive structured action plans, habit suggestions, and daily guidance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Track & Flourish</h3>
              <p className="text-muted-foreground">
                Monitor your progress, build lasting habits, and achieve your goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of people who are already living more intentionally with Aion
            </p>
            <Button asChild size="lg" className="px-12 py-6 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
              <Link href="/onboarding">
                Start Your Free Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 