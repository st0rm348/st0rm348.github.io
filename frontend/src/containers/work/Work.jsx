import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { client, urlFor } from '../../lib/client';
import Modal from './components/Modal.jsx';

import './Work.scss';

const Work = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [workItems, setWorkItems] = useState([]);
  const [workItemsFiltered, setWorkItemsFiltered] = useState([]);
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [categories, setCategories] = useState(['All']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWorkItem, setCurrentWorkItem] = useState();

  const closeModal = () => setIsModalOpen(false);
  const openModal = (workItem) => {
    setCurrentWorkItem(workItem);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchWork = async () => {
      const query = '*[_type == "works"]{..., usedSkills[]->}';
      const works = await client.fetch(query);
      const availableCategories = new Set(['All']);

      works.forEach((work) => {
        work.tags.forEach((tag) => {
          availableCategories.add(tag);
        });
      });

      setCategories(Array.from(availableCategories));
      setWorkItems(works);
      setWorkItemsFiltered(works);
      setActiveFilter('All');
    };

    fetchWork();
  }, []);

  const handleWorkFilter = (category) => {
    setActiveFilter(category);
    setAnimateCard({ y: 100, opacity: 0 });

    setTimeout(() => {
      setAnimateCard({ y: 0, opacity: 1 });

      if (category === 'All') {
        setWorkItemsFiltered(workItems);
      } else {
        setWorkItemsFiltered(workItems.filter((workItem) => workItem.tags.includes(category)));
      }
    }, 500);
  };

  return (
    <>
      <Modal isModalOpen={isModalOpen} closeModal={closeModal} workItem={currentWorkItem} />

      <h2 className="head-text">My Work <span>Portfolio</span></h2>

      <div className="app__work-filter">
        {categories.map((category, index) => (
          <div
            key={`work-filter-category-${index}`}
            onClick={() => handleWorkFilter(category)}
            className={
              `app__work-filter-item app__flex p-text 
              ${activeFilter === category ? 'item-active' : ''}`
            }
          >
            {category}
          </div>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className='app__work-portfolio'
      >
        {workItemsFiltered.map((workItem, index) => (
          <div
            className="app__work-item app__flex"
            key={`work-item-${index}`}
            onClick={() => openModal(workItem)}
          >
            <div className="app__work-img app__flex">
              <img src={urlFor(workItem.imgUrl)} alt={workItem.name} />
            </div>

            <div className="app__work-content app__flex">
              <h4 className="bold-text">{workItem.title}</h4>
              <p className="p-text">{workItem.description}</p>
              <div className="app__work-tag app__flex">
                <p className="p-text">{workItem.tags[0]}</p>
              </div>
            </div>
          </div>
        ))}

      </motion.div>
    </>
  );
};

const WorkWrapped = AppWrap(MotionWrap(Work, 'app__work'), 'work', 'app__primarybg');

export default WorkWrapped;
