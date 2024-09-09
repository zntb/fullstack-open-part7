import React, { useState } from 'react';

import { useCountry, useField } from './hooks';

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  const { common: name } = country.data.name;
  const capital = country.data.capital[0];
  const population = country.data.population;
  const flagUrl = country.data.flags.png;

  return (
    <div>
      <h3>{name} </h3>
      <div>capital {capital} </div>
      <div>population {population}</div>
      <img src={flagUrl} height='100' alt={`flag of ${name}`} />
    </div>
  );
};

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const country = useCountry(name);

  const fetch = e => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
