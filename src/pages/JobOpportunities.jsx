import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlusCircle, HiX, HiLightningBolt, HiAcademicCap, HiChartBar, HiClock } from 'react-icons/hi';

const JobOpportunities = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (index) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Categorized skills
  const skillCategories = {
    all: 'All Skills',
    programming: 'Programming Languages',
    web: 'Web Technologies',
    mobile: 'Mobile Development',
    database: 'Databases & Storage',
    cloud: 'Cloud & DevOps',
    ai: 'AI & Machine Learning',
    design: 'Design & UI/UX',
    tools: 'Tools & Platforms',
    soft: 'Soft Skills',
    other: 'Other Technical Skills'
  };

  const categorizedSkills = {
    programming: [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Go',
      'TypeScript', 'Rust', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell',
      'Assembly', 'Dart', 'Groovy', 'Lua', 'Shell Scripting'
    ],
    web: [
      'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js',
      'Next.js', 'Gatsby', 'Svelte', 'Django', 'Flask', 'Ruby on Rails',
      'Spring Boot', 'Laravel', 'ASP.NET', 'GraphQL', 'REST APIs',
      'WebSockets', 'Progressive Web Apps', 'Web Security', 'Webpack',
      'Sass/SCSS', 'Tailwind CSS', 'Bootstrap', 'Material UI'
    ],
    mobile: [
      'iOS Development', 'Android Development', 'React Native', 'Flutter',
      'Xamarin', 'Swift UI', 'Kotlin Android', 'Mobile UI Design',
      'App Performance', 'Mobile Security', 'Push Notifications',
      'Mobile Analytics', 'Responsive Design', 'Cross-platform Development'
    ],
    database: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
      'Microsoft SQL Server', 'Firebase', 'DynamoDB', 'Cassandra',
      'Neo4j', 'Elasticsearch', 'Database Design', 'SQL', 'NoSQL',
      'Data Modeling', 'Database Optimization', 'Database Security'
    ],
    cloud: [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
      'Terraform', 'Ansible', 'CI/CD', 'Cloud Architecture', 'Serverless',
      'Microservices', 'Container Orchestration', 'Cloud Security',
      'Infrastructure as Code', 'DevOps Practices', 'Site Reliability Engineering'
    ],
    ai: [
      'Machine Learning', 'Deep Learning', 'Natural Language Processing',
      'Computer Vision', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      'Data Science', 'Neural Networks', 'Reinforcement Learning',
      'AI Ethics', 'Big Data', 'Data Mining', 'Statistical Analysis',
      'Predictive Modeling', 'Feature Engineering'
    ],
    design: [
      'UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Sketch',
      'Wireframing', 'Prototyping', 'User Research', 'Visual Design',
      'Interaction Design', 'Design Systems', 'Typography',
      'Color Theory', 'Accessibility Design', 'Motion Design',
      'Design Thinking', 'User Testing'
    ],
    tools: [
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence',
      'Slack', 'VS Code', 'IntelliJ IDEA', 'Eclipse', 'Postman',
      'Chrome DevTools', 'npm', 'Yarn', 'Maven', 'Gradle',
      'Linux', 'Command Line', 'Agile Tools'
    ],
    soft: [
      'Problem Solving', 'Team Collaboration', 'Communication',
      'Project Management', 'Time Management', 'Leadership',
      'Critical Thinking', 'Adaptability', 'Creativity',
      'Attention to Detail', 'Analytical Skills', 'Documentation'
    ],
    other: [
      'System Architecture', 'Network Security', 'Blockchain',
      'IoT Development', 'Game Development', 'Embedded Systems',
      'Cybersecurity', 'Quality Assurance', 'Technical Writing',
      'Performance Optimization', 'API Design', 'Version Control',
      'Testing Methodologies', 'Agile Development', 'Scrum'
    ]
  };

  const predefinedSkills = Object.values(categorizedSkills).flat();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const getDisplaySkills = () => {
    if (activeCategory === 'all') return predefinedSkills;
    return categorizedSkills[activeCategory] || [];
  };

  const analyzeSkills = async () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill');
      setShowRecommendations(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Given these technical skills: ${selectedSkills.join(', ')}, provide an extensive list of ALL possible job roles that could utilize these skills. Consider various industries, experience levels, and combinations of the skills. Return ONLY a JSON array with this exact format, no other text. Include as many relevant jobs as possible:
[
  {
    "title": "Job Title",
    "description": "Detailed job description including industry context, main responsibilities, and potential career growth",
    "experienceLevel": "Entry-Level/Mid-Level/Senior",
    "averageSalary": "Salary range in USD",
    "matchingSkills": ["skills", "from", "user", "input", "that", "match", "this", "role"],
    "additionalSkills": ["recommended", "skills", "to", "learn", "for", "this", "role"],
    "industry": "Primary industry sector"
  }
]`;

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAQw8XVYRNfq0VpXfqnbNpJCRcD8evJ_7E',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract and clean the response text
      let textContent = data.candidates[0].content.parts[0].text.trim();
      
      // Remove any markdown formatting
      textContent = textContent.replace(/json\n|\n|```/g, '').trim();
      
      // Ensure we have valid JSON array
      if (!textContent.startsWith('[')) {
        textContent = textContent.substring(textContent.indexOf('['));
      }
      if (!textContent.endsWith(']')) {
        textContent = textContent.substring(0, textContent.lastIndexOf(']') + 1);
      }

      // Parse the JSON response
      const jobRecommendations = JSON.parse(textContent);
      
      // Update state with the recommendations
      setRecommendations(jobRecommendations);
      setFilteredRecommendations(jobRecommendations);
      setShowRecommendations(true);
    } catch (err) {
      console.error('Error analyzing skills:', err);
      setError('Failed to analyze skills. Please try again.');
      setShowRecommendations(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Job Opportunities
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Select your skills to discover matching career opportunities
          </motion.p>
        </div>
        
        {/* Main Content */}
        <div className="space-y-8">
          {/* Skills Selection Panel */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <HiLightningBolt className="w-6 h-6 mr-2 text-blue-500" />
              Select Your Skills
            </h2>
            
            {/* Selected Skills */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Your Selected Skills</h3>
              <div className="flex flex-wrap gap-2 min-h-[50px] p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <AnimatePresence>
                  {selectedSkills.map((skill) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-transparent dark:text-blue-300 hover:text-gray-700 dark:hover:text-blue-100 transition-colors rounded-full p-1"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* Custom Skill Input */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                    Add Custom Skill
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomSkillAdd()}
                      placeholder="Enter a custom skill..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCustomSkillAdd}
                      className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <HiOutlinePlusCircle className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Skill Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Skill Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(skillCategories).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeCategory === key
                            ? 'bg-blue-600 dark:bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Predefined Skills */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Available Skills</h3>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2">
                    {getDisplaySkills().map((skill) => (
                      <motion.button
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSkillSelect(skill)}
                        disabled={selectedSkills.includes(skill)}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          selectedSkills.includes(skill)
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeSkills}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2 ${
                isLoading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              {isLoading ? (
                <>
                  <HiClock className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <HiChartBar className="w-5 h-5" />
                  <span>Analyze Skills</span>
                </>
              )}
            </motion.button>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-600 dark:text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Job Recommendations Section */}
          {isLoading ? (
            <motion.div 
              className="mt-8 flex flex-col items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Jar Container */}
              <div className="relative w-64 h-80">
                {/* Glass Jar */}
                <motion.div 
                  className="absolute bottom-0 w-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Jar Body - Main container */}
                  <div className="relative">
                    {/* Jar neck */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-20 h-16 bg-gradient-to-r from-blue-100/40 via-blue-100/80 to-blue-100/40 dark:from-blue-900/40 dark:via-blue-900/60 dark:to-blue-900/40 rounded-t-lg"></div>
                    
                    {/* Jar rim */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 w-28 h-4 bg-gradient-to-r from-blue-200/40 via-blue-200/80 to-blue-200/40 dark:from-blue-800/40 dark:via-blue-800/60 dark:to-blue-800/40 rounded-full"></div>
                    
                    {/* Jar body */}
                    <div className="relative h-56 w-full rounded-3xl overflow-hidden">
                      {/* Glass effect - front */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 via-blue-100/80 to-blue-100/40 dark:from-blue-900/40 dark:via-blue-900/60 dark:to-blue-900/40"></div>
                      
                      {/* Glass reflection */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10"></div>
                      
                      {/* Side curves */}
                      <div className="absolute left-0 inset-y-0 w-1/6 bg-gradient-to-r from-blue-200/20 to-transparent dark:from-blue-800/20"></div>
                      <div className="absolute right-0 inset-y-0 w-1/6 bg-gradient-to-l from-blue-200/20 to-transparent dark:from-blue-800/20"></div>
                      
                      {/* Bottom curve */}
                      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-blue-200/40 to-transparent dark:from-blue-800/40"></div>

                      {/* Skills falling animation */}
                      <div className="relative w-full h-full">
                        {selectedSkills.map((skill, index) => (
                          <motion.div
                            key={skill}
                            className="absolute"
                            initial={{ 
                              top: -20, 
                              left: `${Math.random() * 80 + 10}%`,
                              opacity: 1,
                              scale: 1
                            }}
                            animate={[
                              {
                                top: `${50 + Math.random() * 30}%`,
                                left: `${Math.random() * 60 + 20}%`,
                                opacity: 1,
                                scale: 0.8,
                                transition: {
                                  duration: 1,
                                  delay: index * 0.2,
                                  type: "spring",
                                  bounce: 0.4
                                }
                              },
                              {
                                rotate: [0, -10, 10, -10, 0],
                                y: [0, -5, 5, 0],
                                transition: {
                                  duration: 3,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }
                              }
                            ]}
                          >
                            <span className="px-3 py-1 text-sm bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg backdrop-blur-sm">
                              {skill}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Liquid effect */}
                      <motion.div
                        className="absolute bottom-0 w-full h-full bg-gradient-to-t from-blue-300/30 via-blue-200/20 to-transparent dark:from-blue-600/30 dark:via-blue-700/20"
                        animate={{
                          rotate: [0, 2, -2, 0],
                          y: [0, -2, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </div>
                  </div>

                  {/* Sparkles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 180]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Loading text */}
              <motion.p 
                className="mt-6 text-lg text-gray-600 dark:text-gray-400 text-center"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                Analyzing your skills and finding perfect job matches...
              </motion.p>
            </motion.div>
          ) : showRecommendations && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Job Recommendations Based on Your Skills
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Found {recommendations.length} opportunities
                </span>
              </div>
              
              {/* Filters Section */}
              <div className="mb-6 flex flex-wrap gap-3">
                <select 
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onChange={(e) => {
                    const filtered = recommendations.filter(job => 
                      e.target.value === 'all' || job.experienceLevel === e.target.value
                    );
                    setFilteredRecommendations(filtered);
                  }}
                >
                  <option value="all">All Levels</option>
                  <option value="Entry-Level">Entry Level</option>
                  <option value="Mid-Level">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.length > 0 ? (
                  filteredRecommendations.map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all group"
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full shrink-0 ml-2">
                          {job.experienceLevel}
                        </span>
                      </div>

                      {/* Industry */}
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {job.industry}
                      </p>

                      {/* Description */}
                      <div className="mt-3 w-full">
                        <p className={`text-sm text-gray-600 dark:text-gray-300 ${expandedDescriptions[index] ? '' : 'line-clamp-2'}`}>
                          {job.description}
                        </p>
                        {job.description.length > 150 && (
                          <button
                            onClick={() => toggleDescription(index)}
                            className="mt-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-transparent dark:text-blue-400 px-2 py-1 rounded-md focus:outline-none transition-colors"
                          >
                            {expandedDescriptions[index] ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>

                      {/* Skills Section */}
                      <div className="mt-4 space-y-4 w-full">
                        {job.matchingSkills && job.matchingSkills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Your Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.matchingSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full flex items-center"
                                >
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {job.additionalSkills && job.additionalSkills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Recommended Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.additionalSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full flex items-center group-hover:scale-105 transition-transform"
                                >
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">
                      No job recommendations found for your selected skills. Try selecting different skills.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JobOpportunities;