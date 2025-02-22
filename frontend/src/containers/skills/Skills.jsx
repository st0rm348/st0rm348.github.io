/* eslint-disable arrow-body-style */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format as formatDate, compareDesc } from 'date-fns';

import { AppWrap, MotionWrap } from '../../wrapper';
import { client, urlFor } from '../../lib/client';
import CircleAnimation from '../../components/Circle-animation.jsx';

import './Skills.scss';

const processExperienceDate = (experienceData) => {
  const experience = { ...experienceData };
  experience.formattedDate = formatDate(new Date(experienceData.date), 'yyyy-MM');
  return experience;
};

const Skills = () => {
  const [skillGroups, setSkillGroups] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const fetchSkillGroups = async () => {
    const query = '*[_type == "skillGroups"]';
    const skillGroupsData = await client.fetch(query);

    skillGroupsData.sort((a, b) => a.order - b.order);

    setSkillGroups(skillGroupsData);
  };

  const fetchSkills = async () => {
    const query = '*[_type == "skills"]';

    const skillsData = await client.fetch(query);
    skillsData.sort((a, b) => {
      if (a.level === b.level) {
        return a.name[0].charCodeAt(0) - b.name[0].charCodeAt(0);
      }
      return b.level - a.level;
    });
    setSkills(skillsData);
  };

  const fetchExperience = async () => {
    const query = '*[_type == "experience"]{..., works[]->}';
    const experiencesData = await client.fetch(query);

    experiencesData.sort((a, b) => compareDesc(a.date, b.date));
    setExperiences(experiencesData.map(processExperienceDate));
  };

  useEffect(() => {
    fetchSkillGroups();
    fetchSkills();
    fetchExperience();
  }, []);

  return (
    <>
      <h2 className="head-text">Skills & Experience</h2>
      <div className="app__skills-container">
        <motion.div className='app__skillGroups-list'>
          {skillGroups.map((skillGroup) => (
            <motion.div key={skillGroup.name} className='app__skillGroups-item'>
              <h4 className='bold-text'>{skillGroup.name}</h4>
              <motion.div className='app__skills-list'>
                {skills.filter((skill) => {
                  return skill.skillGroup?._ref === skillGroup._id;
                }).map((skill) => (
                  <motion.div
                    className='app__skills-item app__flex'
                    key={`app__skills-${skill.name}`}
                    whileInView={{ opacity: [0, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="app__skills-logo app__flex" style={{ backgroundColor: skill.bgColor }}>
                      <img src={urlFor(skill.icon)} alt={skill.name} />
                      <motion.div
                        className="app__skills-circle"
                        whileInView={{ opacity: [0, 0.5] }}
                      >
                        <CircleAnimation percentage={(skill.level / 5) * 100} />
                      </motion.div>
                    </div>
                    <p className="p-text">{skill.name}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <div className="app__skills-exp">
          {experiences.map((experience) => (
            <motion.div
              className='app__skills-exp-item'
              key={`app__experience${experience.date}`}
            >
              <div className="app__skills-exp-year">
                <p className="bold-text">{experience.formattedDate}</p>
              </div>
              <motion.div className='app__skills-exp-works'>
                {experience.works.map((work) => (
                  <div key={`app__skills-exp-year-${work._key}`}>
                    <a id={work.name}>
                      <motion.div
                        className='app__skills-exp-work'
                      >
                        <h4 className='bold-text'>{work.name}</h4>
                        <p className="p-text">{work.company}</p>
                      </motion.div>
                    </a>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

const SkillsWrapped = AppWrap(MotionWrap(Skills, 'app__skills'), 'skills', 'app__whitebg');

export default SkillsWrapped;
