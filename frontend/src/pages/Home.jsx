import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-slate-950 opacity-40"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          The Ultimate <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Tournament Platform
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thrilling tournaments, build teams, and climb the leaderboards. Designed for competitive gamers and professional organizers.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            color="secondary" 
            variant="shadow" 
            className="font-semibold px-8 py-6 text-lg"
            onClick={() => navigate('/tournaments')}
          >
            Explore Tournaments
          </Button>
          <Button 
            size="lg" 
            color="default" 
            variant="bordered" 
            className="font-semibold px-8 py-6 text-lg border-gray-600 hover:bg-gray-800"
            onClick={() => navigate('/signup')}
          >
            Create an Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
