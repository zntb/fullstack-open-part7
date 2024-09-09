import { useField } from '../hooks';
import { useNavigate } from 'react-router-dom';

const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });

    setNotification(`A new anecdote "${content.value}" created!`);
    navigate('/');
    content.reset();
    author.reset();
    info.reset();
  };

  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.inputProps} />
        </div>
        <div>
          author
          <input {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input {...info.inputProps} />
        </div>
        <button type='submit'>create</button>
        <button type='button' onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
