# Exercises 7.1.-7.3

Let's return to working with anecdotes. Use the redux-free anecdote app found in the repository <https://github.com/fullstack-hy2020/routed-anecdotes> as the starting point for the exercises.

If you clone the project into an existing git repository, remember to _delete the git configuration of the cloned application_:

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

The application starts the usual way, but first, you need to install its dependencies:

```bash
npm install
npm run dev
```

## 7.1: Routed Anecdotes, step 1

Add React Router to the application so that by clicking links in the _Menu_ component the view can be changed.

At the root of the application, meaning the path /, show the list of anecdotes:

![Routed Anecdotes, step 1](./assets/40.png)

The _Footer_ component should always be visible at the bottom.

The creation of a new anecdote should happen e.g. in the path _create_:

![Routed Anecdotes, step 1](./assets/41.png)

## 7.2: Routed Anecdotes, step 2

Implement a view for showing a single anecdote:

![Routed Anecdotes, step 2](./assets/42.png)

Navigating to the page showing the single anecdote is done by clicking the name of that anecdote:

![Routed Anecdotes, step 2](./assets/43.png)

## 7.3: Routed Anecdotes, step3

The default functionality of the creation form is quite confusing because nothing seems to be happening after creating a new anecdote using the form.

Improve the functionality such that after creating a new anecdote the application transitions automatically to showing the view for all anecdotes and the user is shown a notification informing them of this successful creation for the next five seconds:

![Routed Anecdotes, step 3](./assets/44.png)

## Exercises 7.4.-7.8

We'll continue with the app from the [exercises](https://fullstackopen.com/en/part7/custom_hooks) of the [react router](https://fullstackopen.com/en/part7/react_router) chapter.

## 7.4: Anecdotes and Hooks step 1

Simplify the anecdote creation form of your application with the `useField` custom hook we defined earlier.

One natural place to save the custom hooks of your application is in the _/src/hooks/index.js_ file.

If you use the [named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#description) instead of the default export:

```js
import { useState } from 'react';

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

// modules can have several named exports

export const useAnotherHook = () => {
  // ...
};
```

Then [importing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) happens in the following way:

```jsx
import { useField } from './hooks';

const App = () => {
  // ...
  const username = useField('text');
  // ...
};
```

### 7.5: Anecdotes and Hooks step 2

Add a button to the form that you can use to clear all the input fields:

![Routed Anecdotes, step 2](./assets/61ea.png)

Expand the functionality of the _useField_ hook so that it offers a new reset operation for clearing the field.

Depending on your solution, you may see the following warning in your console:

![Routed Anecdotes, step 2](./assets/62ea.png)

We will return to this warning in the next exercise.

### 7.6: Anecdotes and Hooks step 3

If your solution did not cause a warning to appear in the console, you have already finished this exercise.

If you see the `Invalid value for prop `reset` on <input> tag` warning in the console, make the necessary changes to get rid of it.

The reason for this warning is that after making the changes to your application, the following expression:

```jsx
<input {...content} />
```

Essentially, is the same as this:

```jsx
<input
  value={content.value}
  type={content.type}
  onChange={content.onChange}
  reset={content.reset}
/>
```

The _input_ element should not be given a _reset_ attribute.

One simple fix would be to not use the spread syntax and write all of the forms like this:

```jsx
<input
  value={username.value}
  type={username.type}
  onChange={username.onChange}
/>
```

If we were to do this, we would lose much of the benefit provided by the _useField_ hook. Instead, come up with a solution that fixes the issue, but is still easy to use with the spread syntax.
