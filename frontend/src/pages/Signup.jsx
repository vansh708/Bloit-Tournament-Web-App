import { useState } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Player', skillLevel: 'Beginner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-10">
      <Card className="w-full max-w-md bg-slate-900 border border-white/10">
        <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-6">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-sm text-gray-400">Join the Bloit platform</p>
        </CardHeader>
        <CardBody className="py-8">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input 
              label="Name" 
              variant="bordered" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              type="email" 
              label="Email" 
              variant="bordered" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              type="password" 
              label="Password" 
              variant="bordered" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <Select 
              label="Role" 
              variant="bordered"
              defaultSelectedKeys={['Player']}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <SelectItem key="Player" value="Player">Player</SelectItem>
              <SelectItem key="Organizer" value="Organizer">Organizer</SelectItem>
            </Select>
            <Select 
              label="Skill Level" 
              variant="bordered"
              defaultSelectedKeys={['Beginner']}
              onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
            >
              <SelectItem key="Beginner" value="Beginner">Beginner</SelectItem>
              <SelectItem key="Intermediate" value="Intermediate">Intermediate</SelectItem>
              <SelectItem key="Advanced" value="Advanced">Advanced</SelectItem>
              <SelectItem key="Pro" value="Pro">Pro</SelectItem>
            </Select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              type="submit" 
              color="secondary" 
              variant="shadow" 
              isLoading={loading}
              className="mt-4"
            >
              Sign Up
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Signup;
