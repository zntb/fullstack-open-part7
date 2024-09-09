import { useParams } from 'react-router-dom';

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  const anecdote = anecdotes.find(a => a.id === Number(id));

  if (!anecdote) {
    return <div>Anecdote not found</div>;
  }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>By {anecdote.author}</p>
      <p>Has {anecdote.votes} votes</p>
      <p>
        For more info, see <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </div>
  );
};

export default Anecdote;
