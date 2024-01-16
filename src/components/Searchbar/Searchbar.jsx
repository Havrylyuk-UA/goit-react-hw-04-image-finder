import { useState } from 'react';
import searchImg from './free-icon-loupe-751463.png';

const initialValue = {
  word: '',
};

const Searchbar = ({ handleSearchImage }) => {
  const [word, setWord] = useState(initialValue);

  const handleSearch = e => {
    e.preventDefault();
    handleSearchImage(word.word.trim());
    clearForm();
  };

  const clearForm = () => {
    setWord(initialValue);
  };

  const handleChangeWord = e => {
    const targetWord = e.target.value;
    setWord({ word: targetWord });
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={handleSearch}>
        <button type="submit" className="SearchForm-button">
          <img src={searchImg} alt="search-img" className="search-icon" />
        </button>

        <input
          className="SearchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChangeWord}
          value={word.word}
        />
      </form>
    </header>
  );
};

export default Searchbar;
