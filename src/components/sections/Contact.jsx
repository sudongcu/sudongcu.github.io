import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send } from 'lucide-react';
import { CONTACT_INFO } from '../../constants';

const Contact = () => {
  const socialLinks = [
    { icon: Github, url: CONTACT_INFO.github, label: 'GitHub' },
    { icon: Linkedin, url: CONTACT_INFO.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: CONTACT_INFO.twitter, label: 'Twitter' },
  ];

  return (
    <section id="contact" className="relative py-20 bg-dark-900">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's work together to bring your ideas to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Let's Connect
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                I'm always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say hi,
                feel free to reach out!
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/30 transition-colors">
              <div className="p-3 bg-primary-500/20 rounded-lg">
                <Mail className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-white hover:text-primary-400 transition-colors font-medium"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-gray-400 mb-4">Follow me on social media</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all group"
                      whileHover={{ y: -5 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-6 h-6 text-gray-400 group-hover:text-primary-400 transition-colors" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-20 pt-8 border-t border-dark-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Portfolio. Built with React, Three.js & Tailwind CSS
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;
