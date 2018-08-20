import React, { Component } from 'react';
import { 
  Subject, 
  from,
} from 'rxjs';
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
        debounceTime(350),
        filter(query => query.length >= 2 || query.length === 0), 
        distinctUntilChanged(), 
        switchMap(value => value ?
            from(searchGithub(value)) : from(Promise.resolve({items: []}))
          )
      )
    this.state = {
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
    this.subject.next(event.target.value);
  }

  render() {
    return (
      <div>
        <input type="text"
          placeholder="Search Github Users"
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
