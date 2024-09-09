import { useField, useResource } from './hooks';

const App = () => {
  const content = useField('text');
  const name = useField('text');
  const number = useField('text');

  const baseUrl = 'http://localhost:3005';

  const [notes, noteService] = useResource(`${baseUrl}/notes`);
  const [persons, personService] = useResource(`${baseUrl}/persons`);

  const handleNoteSubmit = event => {
    event.preventDefault();
    noteService.create({ content: content.value });
    content.onChange({ target: { value: '' } });
  };

  const handlePersonSubmit = event => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    name.onChange({ target: { value: '' } });
    number.onChange({ target: { value: '' } });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
