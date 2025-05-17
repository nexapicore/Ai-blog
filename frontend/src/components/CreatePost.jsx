import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CreatePost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [community, setCommunity] = useState('');
  const [tags, setTags] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('neutral');
  const [length, setLength] = useState(500);
  const [factCheckResult, setFactCheckResult] = useState(null);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/v1/communities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommunities(res.data);
    };
    fetchCommunities();
  }, []);

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      '/api/v1/generate-article',
      { prompt, tone, maxLength: length },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setContent(res.data.article);
    setTags(res.data.tags || []);
  };

  const handleFactCheck = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      '/api/v1/fact-check',
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFactCheckResult(res.data.factCheck);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/v1/posts',
      { title, content, community, tags },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Redirect to community page
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen bg-gray-100"
    >
      <div className="w-full md:w-1/4 p-4 bg-gray-200 border-r">
        <h2 className="text-xl mb-4">AI Tools</h2>
        <div className="mb-4">
          <h3>Generate Article</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border"
            placeholder="Enter AI prompt..."
          />
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border my-2"
          >
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
          <input
            type="range"
            min="100"
            max="2000"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleGenerate}
            className="bg-blue-500 text-white p-2 w-full"
          >
            Generate
          </motion.button>
        </div>
        <div>
          <h3>Fact-Check</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleFactCheck}
            className="bg-green-500 text-white p-2 w-full"
          >
            Check Now
          </motion.button>
          {factCheckResult && (
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              className="p-4 bg-gray-100 mt-2"
            >
              {factCheckResult}
            </motion.div>
          )}
        </div>
      </div>
      <div className="w-full md:w-3/4 p-4">
        <div className="flex justify-between items-center bg-gray-800 text-white p-4 mb-4">
          {user.useProfilePhoto && user.xProfilePhoto ? (
            <img src={user.xProfilePhoto} alt="Profile" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          )}
          <span>{user.name}</span>
          <button className="bg-red-500 text-white px-2 py-1">Logout</button>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full p-2 border mb-4"
        />
        <select
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          className="w-full p-2 border mb-4"
        >
          <option value="">Select Community</option>
          {communities.map(c => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        <div className="flex gap-2 mb-4">
          {tags.map(tag => (
            <span key={tag} className="bg-blue-200 px-2 py-1 rounded">{tag}</span>
          ))}
          <button className="bg-gray-300 px-2 py-1">+</button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 p-2 border mb-4"
          placeholder="Write your post..."
        />
        <div className="p-4 bg-white border mb-4">
          <h3 className="text-lg">{title || 'Preview'}</h3>
          <p>{content.substring(0, 200)}...</p>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => console.log('Save Draft')}
            className="bg-gray-500 text-white p-2"
          >
            Save Draft
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2"
          >
            Post
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
