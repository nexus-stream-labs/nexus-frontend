'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  TrendingUp,
  Database,
  Activity,
  Lock,
  Gauge,
  Layers,
  Play,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Rocket,
  Target,
  Clock
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Dynamically import Particles component to avoid SSR issues
const Particles = dynamic(() => Promise.resolve(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {typeof window !== 'undefined' && [...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        transition={{
          duration: Math.random() * 20 + 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>
)), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Floating animation for hero elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-scroll animation for metrics with smooth transitions
  const [currentMetric, setCurrentMetric] = useState(0);
  const metrics = [
    { value: '99.99%', label: 'Uptime SLA', color: 'from-green-400 to-emerald-600' },
    { value: '10M+', label: 'Messages/sec', color: 'from-blue-400 to-cyan-600' },
    { value: '<5ms', label: 'Latency', color: 'from-purple-400 to-violet-600' },
    { value: '500+', label: 'Enterprise Clients', color: 'from-orange-400 to-red-600' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Process millions of events per second with ultra-low latency and guaranteed delivery.',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Enterprise Security',
      description: 'End-to-end encryption, RBAC, audit logs, and compliance with SOC2, GDPR, HIPAA.',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'AI-Powered Analytics',
      description: 'Deep insights into your data streams with ML-powered anomaly detection and predictions.',
      gradient: 'from-purple-400 to-violet-500'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Scale',
      description: 'Multi-region deployment with automatic failover and disaster recovery worldwide.',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: 'Real-time Monitoring',
      description: 'Live dashboards, intelligent alerting, and performance optimization recommendations.',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Schema Evolution',
      description: 'Backward-compatible schema changes with automatic data transformation and validation.',
      gradient: 'from-indigo-400 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO',
      company: 'TechCorp',
      avatar: '👩‍💼',
      content: 'Nexus transformed our real-time analytics. We process 50M events daily with zero downtime. The ROI was immediate.',
      rating: 5,
      metrics: '50M events/day'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Engineering',
      company: 'StreamFlow',
      avatar: '👨‍💻',
      content: 'The monitoring capabilities are incredible. We detected and prevented 3 major outages last month alone.',
      rating: 5,
      metrics: '99.99% uptime'
    },
    {
      name: 'Emily Watson',
      role: 'Data Architect',
      company: 'HealthTech',
      avatar: '👩‍⚕️',
      content: 'HIPAA compliance out of the box. Nexus made our healthcare data streaming secure and scalable instantly.',
      rating: 5,
      metrics: 'HIPAA compliant'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small teams and proof of concepts',
      features: [
        'Up to 1M messages/month',
        '3 topics',
        'Basic monitoring',
        'Email support',
        '99.9% SLA'
      ],
      popular: false,
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Professional',
      price: '$499',
      period: '/month',
      description: 'Ideal for growing businesses and production workloads',
      features: [
        'Up to 100M messages/month',
        'Unlimited topics',
        'Advanced analytics',
        'Priority support',
        '99.95% SLA',
        'Multi-region deployment'
      ],
      popular: true,
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large-scale deployments with custom requirements',
      features: [
        'Unlimited messages',
        'Custom integrations',
        'Dedicated support team',
        '99.99% SLA',
        'On-premise deployment',
        'Custom compliance'
      ],
      popular: false,
      gradient: 'from-gold-600 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Particles />
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 animate-pulse" />
      
      {/* Navigation */}
      <motion.header 
        className="fixed top-0 w-full z-50 border-b border-white/10"
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
          backgroundColor: 'rgba(15, 23, 42, 0.8)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Nexus
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'Customers', 'Docs'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors relative"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
            >
              <nav className="flex flex-col space-y-4">
                {['Features', 'Pricing', 'Customers', 'Docs'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" className="text-white hover:bg-white/10 justify-start">
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 justify-start"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border-purple-600/30 backdrop-blur-sm">
                <Rocket className="mr-2 h-4 w-4" />
                🚀 Now supporting 10M+ messages per second
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The Future of
              <motion.span 
                className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Event Streaming
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Build real-time applications with enterprise-grade event streaming. 
              Process millions of events per second with ultra-low latency, 
              guaranteed delivery, and comprehensive monitoring.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 shadow-2xl"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try Live Demo
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Watch Demo Video
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated Metrics with enhanced design */}
            <motion.div
              key={currentMetric}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div className={`text-5xl font-bold bg-gradient-to-r ${metrics[currentMetric].color} bg-clip-text text-transparent mb-2`}>
                {metrics[currentMetric].value}
              </div>
              <div className="text-gray-400 text-lg">
                {metrics[currentMetric].label}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-500/30 rounded-full blur-sm"
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-blue-500/20 rounded-full blur-sm"
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale real-time applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="p-6 relative z-10">
                    <motion.div 
                      className={`text-white mb-4 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${feature.gradient} p-3 rounded-xl w-fit`}
                      whileHover={{ rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Monitoring Dashboard
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Get complete visibility into your streaming infrastructure with real-time metrics and insights
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl"
              >
                <Activity className="mr-2 h-5 w-5" />
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                  { icon: Activity, label: 'Messages/sec', value: '125.4K', color: 'green', trend: 'up' },
                  { icon: Database, label: 'Data Processed', value: '2.8TB', color: 'blue', trend: 'up' },
                  { icon: Users, label: 'Healthy Nodes', value: '15', color: 'purple', trend: 'stable' }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <metric.icon className={`h-8 w-8 text-${metric.color}-400`} />
                          <Badge className={`bg-${metric.color}-400/20 text-${metric.color}-400`}>
                            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} Live
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                        <div className="text-gray-400">{metric.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join hundreds of companies processing billions of events daily
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                        <div className="text-sm text-purple-400">{testimonial.company}</div>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    <Badge className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border-purple-600/30">
                      {testimonial.metrics}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your scale. All plans include our core features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: plan.popular ? 1.05 : 1.02 }}
              >
                <Card className={`relative h-full ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-purple-600/20 to-blue-600/20 border-purple-500/50 scale-105' 
                    : 'bg-white/5 border-white/10'
                } backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group overflow-hidden`}>
                  
                  {plan.popular && (
                    <motion.div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                      initial={{ scale: 0, rotate: -10 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      viewport={{ once: true }}
                    >
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-400 text-lg">{plan.period}</span>
                      </div>
                      <p className="text-gray-300">{plan.description}</p>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>
                          <motion.div 
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        size="lg"
                      >
                        {plan.name === 'Enterprise' ? (
                          <>
                            <Users className="mr-2 h-4 w-4" />
                            Contact Sales
                          </>
                        ) : (
                          <>
                            <Rocket className="mr-2 h-4 w-4" />
                            Start Free Trial
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10" />
              <CardContent className="p-12 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Data Streaming?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of developers building the next generation of real-time applications
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg"
                        onClick={() => router.push('/dashboard')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 shadow-2xl"
                      >
                        <Rocket className="mr-2 h-5 w-5" />
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg"
                        variant="outline" 
                        className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm"
                      >
                        <Clock className="mr-2 h-5 w-5" />
                        Schedule Demo
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-white/10 py-12 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Nexus
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                The future of event streaming. Built for scale, designed for developers.
              </p>
            </motion.div>
            
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Documentation', 'API Reference']
              },
              {
                title: 'Company', 
                links: ['About', 'Blog', 'Careers', 'Contact']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Community', 'Status', 'Security']
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a 
                        href="#" 
                        className="hover:text-white transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 Nexus. All rights reserved. Built with ❤️ for developers.</p>
          </motion.div>
        </div>
      </footer>

      {/* Enhanced Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl z-40 backdrop-blur-sm border border-white/10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: scrollY.get() > 500 ? 1 : 0, scale: scrollY.get() > 500 ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <ChevronDown className="h-6 w-6 rotate-180" />
      </motion.button>
    </div>
  );
}