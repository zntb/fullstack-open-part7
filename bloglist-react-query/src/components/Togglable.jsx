import { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ToggleButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 17px auto;
  text-align: center;
`;

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Container>
      {!visible && (
        <ToggleButton onClick={toggleVisibility}>
          {props.buttonLabel}
        </ToggleButton>
      )}
      {visible && (
        <div>
          {props.children}
          <ToggleButton onClick={toggleVisibility}>Cancel</ToggleButton>
        </div>
      )}
    </Container>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
