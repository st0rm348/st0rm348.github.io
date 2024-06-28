import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { client, urlFor } from '../../lib/client';

import './About.scss';

const About = () => {
  const [abouts, setAbouts] = useState([]);

  useEffect(() => {
    const query = '*[_type == "abouts"]';

    const fetchAbouts = async () => {
      const data = await client.fetch(query);
      data.sort((a, b) => a.order - b.order);
      setAbouts(data);
    };

    fetchAbouts();
  }, [])

  return (
    <>
      <h2 className='head-text'>
        Let's <span>collaborate</span> to create something truly <span>exceptional</span> together!
      </h2>

      <div className='app__profiles'>
        {abouts.map((about, index) => (
          <motion.div
          whileInView={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, type: 'tween' }}
          className="app__profile-item"
          key={about.title + index}
          >
            <img src={urlFor(about.imgUrl)} alt={about.title} />
            <h2 className="bold-text" style={{ marginTop: 20 }}>{about.title}</h2>
            <p className="p-text" style={{ marginTop: 10 }}>{about.description}</p>
          </motion.div>
        ))}
      </div>
    </>
  )
}
export default About