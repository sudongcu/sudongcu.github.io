import { motion } from 'framer-motion';
import { Shield, Users, Mail, FileText, Timer } from 'lucide-react';

const ScreenTimer = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/15 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-white/60 text-sm">Screen Timer Chrome Extension</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-white/60">
            <span>Last Updated: June 1, 2026</span>
            <span>•</span>
            <span>Version: 1.0.1</span>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Section icon={FileText} title="Overview">
          <p className="text-white/80 leading-relaxed">
            Screen Timer (the "extension") respects your privacy. The extension
            does <strong className="text-white">not</strong> collect, store on
            external servers, transmit, sell, or share any personal or user data.
          </p>
        </Section>

        <Section icon={Timer} title="How the Extension Works">
          <ul className="space-y-3">
            <InfoItem
              title="Auto Timer by Website"
              description="To start a timer automatically on sites you have configured, the extension reads the domain of your currently active tab locally, on your device, solely to decide whether a timer should run. This information is never sent anywhere."
            />
            <InfoItem
              title="Local Settings"
              description="Your settings — such as timer durations, the websites you configure, and your theme preference — are stored locally in your browser using Chrome's local storage and never leave your device."
            />
          </ul>
        </Section>

        <Section icon={Users} title="Third Parties">
          <p className="text-white/80">
            The extension uses no external servers, no analytics, and no third-party services. No data is shared with anyone.
          </p>
        </Section>

        <Section icon={Shield} title="Limited Use">
          <p className="text-white/80">
            The use of information received from Google APIs adheres to the{' '}
            <a
              href="https://developer.chrome.com/docs/webstore/program-policies/limited-use/"
              className="text-white underline underline-offset-4 hover:text-white/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Web Store User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </Section>

        <Section icon={Mail} title="Contact">
          <p className="text-white/80 mb-4">
            Questions about this policy?
          </p>
          <div className="text-white/80">
            <a
              href="mailto:sudongcu.work@gmail.com"
              className="text-white underline underline-offset-4 hover:text-white/80"
            >
              sudongcu.work@gmail.com
            </a>
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/15 text-center text-white/60 text-sm italic"
        >
          <p>Screen Timer — Chrome extension</p>
        </motion.div>
      </main>
    </div>
  );
};

const Section = ({ icon: Icon, title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12"
  >
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
      {Icon && <Icon className="w-6 h-6 text-white" />}
      {title}
    </h2>
    <div className="bg-white/[0.03] rounded-lg p-6 border border-white/15">
      {children}
    </div>
  </motion.section>
);

const InfoItem = ({ title, description }) => (
  <li className="bg-white/[0.04] rounded-lg p-4 border border-white/15">
    <h4 className="font-semibold text-white mb-1">{title}:</h4>
    <p className="text-white/70 text-sm">{description}</p>
  </li>
);

export default ScreenTimer;
