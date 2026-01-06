import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import { CONTACT_INFO } from '../../constants';

const Contact = () => {
  const socialLinks = [
    { icon: Github, url: CONTACT_INFO.github, label: 'GitHub' },
    { icon: Linkedin, url: CONTACT_INFO.linkedin, label: 'LinkedIn' }
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

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Email */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Let's Connect
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Feel free to reach out for projects, opportunities, or just to say hi.
                </p>
              </div>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all group"
              >
                <div className="p-3 bg-primary-500/20 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium group-hover:text-primary-400 transition-colors">
                    {CONTACT_INFO.email}
                  </p>
                </div>
              </a>
            </motion.div>

            {/* Right Side - Social Links */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Follow Me
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Connect with me on social platforms
                </p>
              </div>

              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all group"
                      whileHover={{ y: -5 }}
                      aria-label={social.label}
                    >
                      <div className="p-3 bg-primary-500/20 rounded-lg">
                        <Icon className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
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
          Designed & Developed by Donggu Seo © {new Date().getFullYear()}
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;
