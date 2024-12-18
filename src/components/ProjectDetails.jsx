import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const [status, setStatus] = useState('in-progress');
  const location = useLocation();
  const [details, setDetails] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [progress, setProgress] = useState(0);

  const api = import.meta.env.VITE_API_URL
  const projectDetails =  ()=>{
       const {id} = useParams();

    useEffect( ()=>{

      const fetchdata = async ()=>{

        try{
           const {data} = await axios.get(`${api}/api/projects/${id}`)
           setDetails(data) 
           setSubtasks(data.tasks)
         }
         catch(err){
           console.log(err.message)
         }
      }
      fetchdata();
       },[id])
      }
      projectDetails();

  useEffect(() => {
    // Calculate progress based on completed subtasks
    const completedTasks = subtasks.filter(task => task.status === 'Completed').length;
    const newProgress = Math.round((completedTasks / subtasks.length) * 100);
    setProgress(newProgress);

    // Automatically update status if all tasks are completed
    if (newProgress === 100) {
      setStatus('completed');
    }
  }, [subtasks]);

  const toggleSubtask = async (taskId) => {
    try {
       const {data} = await axios.get(`http://localhost:3000/api/tasks/${taskId}/complete`);
         setSubtasks(data.tasks)
       
    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    if (subtasks.length > 0) {
        const statuses = subtasks.map(task => task.status); // Extract statuses
        setStatus(statuses); // Store them in the state
      
    }
}, [subtasks]); 



  const handleComplete = () => {
    setStatus('completed');
  };

  const handleFail = () => {
    setStatus('failed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header with Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Project Details
            </h1>
            {status === 'in-progress' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                <span className="flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Mark Project Complete
                </span>
              </motion.button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-600">Overall Progress</span>
              <span className="text-purple-600">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  status === 'completed' 
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : status === 'failed'
                    ? 'bg-gradient-to-r from-red-400 to-red-500'
                    : 'bg-gradient-to-r from-purple-400 to-indigo-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Project Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6 space-y-6"
          >
            {/* Project Title and Timeline */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
               {details.title}
              </h2>
              <div className="flex flex-col space-y-2">
                <span className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  {details.deadline}
                </span>
                <span className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  {details.time}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-purple-50/50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                Project Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
              { details.description}
              </p>
            </div>

            {/* Status Warning */}
            {status === 'in-progress' && progress < 100 && (
              <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                <FiAlertCircle className="text-xl mr-2" />
                <p className="text-sm">
                  Complete all tasks to finish the project.
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Panel - Subtasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Tasks</h3>
            <div className="space-y-3">
              {subtasks.map((task) => (
                <motion.div
                
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer
                    ${task.status === 'Completed' 
                      ? 'bg-purple-50 border-purple-200' 
                      : 'bg-white border-gray-200'
                    } hover:shadow-md`}
                  onClick={() => toggleSubtask(task._id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${task.status === 'Completed' 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-300'
                      }`}
                    >
                      {task.status === 'Completed' && <FiCheckCircle className="text-white text-sm" />}
                    </div>
                    <span className={`flex-1 ${task.completed ? 'text-purple-600' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    <FiChevronRight className={`${task.completed ? 'text-purple-500' : 'text-gray-400'}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
