import React, { useState } from 'react';
import './Register.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Client-side validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.warning('⚠️ Please fill out all fields.');
      return;
    }

    const defaultProfilePic = 'https://via.placeholder.com/100';
    const defaultBanner = 'https://via.placeholder.com/800x200';

    const payload = {
      ...formData,
      profilePic: defaultProfilePic,
      banner: defaultBanner,
    };

    try {
      const res = await fetch('https://mini-linkedin-w94t.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          toast.error(`❌ ${data.error || 'Registration failed'}`);
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
        return;
      }

      toast.success('✅ Registered successfully!');
      setFormData({ name: '', email: '', password: '' });

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create your account</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

