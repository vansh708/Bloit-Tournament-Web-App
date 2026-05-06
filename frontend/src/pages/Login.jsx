import { useState } from 'react';
import { Input, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false)   ;  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <Card className="w-full max-w-md bg-slate-900 border border-white/10">
        <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-sm text-gray-400">Login to your Bloit account</p>
        </CardHeader>
        <CardBody className="py-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input 
              type="email" 
              label="Email" 
              variant="bordered" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              type="password" 
              label="Password" 
              variant="bordered" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              type="submit" 
              color="secondary" 
              variant="shadow" 
              isLoading={loading}
              className="mt-4"
            >
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
