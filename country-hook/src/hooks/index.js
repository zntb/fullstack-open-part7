import axios from 'axios';
import { useState, useEffect } from 'react';

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

export const useCountry = name => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      axios
        .get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}?fullText=true`,
        )
        .then(response => {
          setCountry({
            found: true,
            data: response.data,
          });
        })
        .catch(() => {
          setCountry({
            found: false,
          });
        });
    }
  }, [name]);

  return country;
};
