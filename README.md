## React-Observable

This uses an observable in conjunction with React to make an autocomplete using fetch requests from a backend.

```javascript
import React, { Component } from 'react';
import { Subject, from } from 'rxjs';
import {  
          filter, 
          debounceTime, 
          distinctUntilChanged,
          switchMap,
         } from 'rxjs/operators';

let searchGithub = (term) =>
    fetch(`https://api.github.com/search/users?q=${term}`)
    .then(data => data.json());

class App extends Component {
  constructor() {
    super()
    this.subject = new Subject()
      .pipe(
        debounceTime(500),
        filter(value => value.length > 2),
        distinctUntilChanged(),
        switchMap(value => 
          from(searchGithub(value))),
      )
    this.state = {
      input: '',
      results: [],
    }
  }

  componentDidMount() {
      this.subject
        .subscribe(data => this.setState({ results: data.items }));
  }

  componentWillUnmount() {
    this.subject.complete();
  }

  handleOnChange = (event) => {
    this.setState({ input: event.target.value });
    this.subject.next(event.target.value);
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.input} 
          onChange={this.handleOnChange} />
        <ul>{
          this.state.results.map((result, i) => 
            <li key={i}>{result.login}</li>)
        }</ul>
      </div>
    );
  }
}

export default App;


```
