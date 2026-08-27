import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import axios from 'axios';
import SectionHeader from '../ui/SectionHeader';
import TiltCard from '../ui/TiltCard';

const EASE = [0.16, 1, 0.3, 1];
const FEED_URL = 'https://medium.com/feed/@between-coding-and-life';
const MEDIUM_URL = 'https://medium.com/@between-coding-and-life';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const Skeleton = () => (
  <div className="glass h-[22rem] animate-pulse overflow-hidden">
    <div className="h-44 bg-white/[0.04]" />
    <div className="space-y-3 p-6">
      <div className="h-3 w-24 rounded bg-white/[0.06]" />
      <div className="h-5 w-4/5 rounded bg-white/[0.08]" />
      <div className="h-3 w-full rounded bg-white/[0.05]" />
      <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
    </div>
  </div>
);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`,
        );
        if (response.data.status === 'ok') {
          setPosts(response.data.items.slice(0, 3));
        } else {
          setError('Failed to fetch blog posts');
        }
      } catch (err) {
        setError('Error loading blog posts');
        console.error('Blog fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  return (
    <section id="blog" className="relative py-24 sm:py-32">
      <div className="section-container relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            index="04"
            label="Writing"
            title={
              <>
                Notes from
                <br />
                <span className="text-ice">between coding and life.</span>
              </>
            }
          />
          <motion.a
            href={MEDIUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <BookOpen className="h-4 w-4 text-frost" />
            All posts on Medium
          </motion.a>
        </div>

        <div className="mt-14">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : error ? (
            <p className="font-mono text-sm text-ice-200/50">
              {error}. Read directly on{' '}
              <a href={MEDIUM_URL} target="_blank" rel="noopener noreferrer" className="text-frost hover:underline">
                Medium
              </a>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {posts.map((post, index) => (
                <motion.article
                  key={post.guid ?? post.link ?? index}
                  className="h-full min-w-0"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
                >
                  <TiltCard className="glass glass-hover group h-full overflow-hidden">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full flex-col"
                    >
                      {post.thumbnail && (
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />
                        </div>
                      )}

                      <div data-frost-clear className="flex flex-1 flex-col p-6">
                        <time className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost/80">
                          {formatDate(post.pubDate)}
                        </time>
                        <h3 className="mt-3 line-clamp-2 font-display text-xl font-bold tracking-tight text-ice-50 transition-colors group-hover:text-frost">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ice-200/60">
                          {stripHtml(post.description)}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-6">
                          {post.categories && post.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {post.categories.slice(0, 2).map((category) => (
                                <span key={category} className="chip !px-2 !py-0.5 !text-[11px]">
                                  {category}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span />
                          )}
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-ice-200/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-frost" />
                        </div>
                      </div>
                    </a>
                  </TiltCard>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
