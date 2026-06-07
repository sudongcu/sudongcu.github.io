import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, FlaskConical } from 'lucide-react';
import Logo from '../../components/Logo';
import { useSeo } from '../../hooks/useSeo';

const TOOLS = [
  {
    slug: 'phoneframe',
    title: 'PhoneFrame',
    description: 'Upload an image to wrap it in a phone mockup frame and download as PNG. Auto-detects portrait or landscape.',
    icon: Smartphone,
    tags: ['Image', 'Mockup', 'Export'],
  },
];

const Lab = () => {
  useSeo({
    title: 'Lab — Free Browser Developer Tools | DG.DEV',
    description: 'Compact web tools that run entirely in your browser. No signup, no uploads. PhoneFrame mockup generator and more.',
    path: '/lab',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'DG.DEV Lab',
      url: 'https://sudongcu.github.io/lab',
      description: 'Collection of free browser-based developer tools.',
    },
  });

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <Logo to="/" />
          </div>
          <div className="justify-self-center inline-flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary-400" />
            <span className="text-2xl font-bold text-gradient tracking-wide">Lab</span>
          </div>
          <div className="justify-self-end" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-gray-400 text-lg max-w-2xl">
            Compact web tools built for everyday tasks — pick one and try it out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
              >
                <Link
                  to={`/lab/${tool.slug}`}
                  className="group block h-full bg-dark-700 hover:bg-dark-600/80 border border-dark-600 hover:border-primary-500/40 rounded-xl p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-dark-800 text-gray-400 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + TOOLS.length * 0.08 }}
            className="bg-dark-800/40 border border-dashed border-dark-600 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]"
          >
            <div className="text-gray-500 mb-2 text-3xl">+</div>
            <p className="text-gray-500 text-sm">More tools coming soon</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Lab;
