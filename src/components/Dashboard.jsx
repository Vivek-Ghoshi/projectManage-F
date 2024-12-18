import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiArrowRight, FiFolder, FiFlag, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const api = import.meta.env.VITE_API_URL
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  
  const [status, setStatus] = useState('');

  const allProjects = async (e)=>{
      try {
          
        const response = await axios.get(`${api}/api/projects/all`);
       
        setProjects(response.data)

      } catch (error) {
        console.log(error.message)
      }
  }
  allProjects();

  const DetailsHandler = async (id)=>{
    
    try {
        const { data } = await axios.get(`${api}/api/projects/${id}`)
        
        navigate(`/projects/${id}`,{
          state:{ project : data}
        });
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleAcceptProject = (id) => {
    try {
         const response = axios.get(`${api}/api/projects/accept/${id}`);

    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(()=>{
       
  },[])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Dashboard Header */}
        <div className="text-left space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          All Projects
          </h1>
          
        </div>

        {/* Stats Overview */}
        {/* <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {[
            { title: 'Pending', icon: FiClock, count: projects.filter(p => p.status === 'pending').length },
            { title: 'In Progress', icon: FiTrendingUp, count: projects.filter(p => p.status === 'accepted').length },
            { title: 'Completed', icon: FiCheckCircle, count: projects.filter(p => p.status === 'completed').length }
          ].map(({ title, icon: Icon, count }) => (
            <motion.div
              key={title}
              variants={item}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="text-2xl text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {count}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Projects List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project._id}
              variants={item}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiFolder className="text-2xl text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.title}
                    </h3>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600">{project.description}</p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <FiClock className="mr-2" />
                      <span>Due: {project.deadline}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
                      <FiFlag className="inline mr-1" />
                      {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                    </span>
                  </div>

                  {project.status === 'Pending' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptProject(project._id)}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      <FiCheckCircle className="mr-2" />
                      Accept Project
                    </motion.button>
                  )}

                  {project.status === 'Accepted' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e)=>DetailsHandler(project._id)}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      <FiArrowRight className="mr-2" />
                      View Details
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
