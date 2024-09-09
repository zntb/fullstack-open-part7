import { useState, useEffect } from 'react';
import axios from 'axios';

export const useField = type => {
  const [value, setValue] = useState('');

  const onChange = event => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useResource = baseUrl => {
  const [resources, setResources] = useState([]);

  const getAll = async () => {
    try {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources', error);
    }
  };

  const create = async newObject => {
    try {
      const response = await axios.post(baseUrl, newObject);
      setResources(prevResources => prevResources.concat(response.data));
    } catch (error) {
      console.error('Error creating resource', error);
    }
  };

  useEffect(() => {
    getAll();
  }, [baseUrl]);

  return [resources, { create }];
};
