import axios from 'axios';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Progress = () => {
  const api = import.meta.env.VITE_API_URL
  const [stats, setStats] = useState({});
  useEffect( ()=>{
    const { id } =  JSON.parse(localStorage.getItem('userId'));
      const fetchStats =  async(id)=>{
         try {
             const {data} = await axios.get(`${api}/api/auth/${id}/progress`)
             setStats(data)
         } catch (error) {
           console.log(error.message)
         }
      }
      fetchStats(id)
  },[]);

  const [score, setScore] = useState(0);
  useEffect(() => {
    // Calculate score based on completion rates
    const taskScore = (stats.tasksCompleted / stats.totalTasks) * 50;
    const projectScore = (stats.projectsCompleted / stats.totalProjects) * 50;
    setScore(Math.round(taskScore + projectScore));
  }, [stats]);

  const ProgressCircle = ({ percentage, label }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-32 h-32"
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-gray-200"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <motion.circle
          className="stroke-indigo-600"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            strokeDasharray: "283",
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4"> <span className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'>{stats.name}'s</span> Dashboard</h1>
        <p className="text-gray-600">Track your performance and achievements</p>
      </motion.div>

      {/* Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Performance Score</h2>
            <p className="text-indigo-100">Based on your completion rate</p>
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold"
          >
            {stats.performanceScore}
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Task Progress */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Task Completion</h3>
          <ProgressCircle 
            percentage={Math.round((stats.tasksCompleted / stats.totalTasks) * 100)} 
            label="Tasks"
          />
          <div className="mt-4 text-center text-gray-600">
            {stats.tasksCompleted} tasks completed
          </div>
        </motion.div>

        {/* Project Progress */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Total Tasks</h3>
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <span className="text-3xl font-bold text-white">{stats.totalTasks}</span>
              <span className="text-sm text-indigo-100">Total</span>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-600">
            Total tasks in project
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Progress;
