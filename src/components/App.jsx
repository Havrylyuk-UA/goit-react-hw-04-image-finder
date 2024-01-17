import React, { useState, useEffect } from 'react';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import api from '../services/api';

import './styles.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState(1);
  const [per_page] = useState(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageDetails, setImageDetails] = useState({});
  const [search, setSearch] = useState(null);
  const [canFind, setCanFind] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateState = async () => {
      try {
        setIsLoading(true);
        setSearch(null);
        setCanFind(false);

        const searchImages = await api.fetchImages(searchWord, page, per_page);

        if (searchImages.hits.length === 0) {
          setIsLoading(true);
          setSearch(null);
          setCanFind(true);
        }

        setImages(prevImages => [...prevImages, ...searchImages.hits]);
        const updateLimit = totalHits => {
          const limit = Math.ceil(totalHits / per_page);
          setSearch(page < limit);
        };
        updateLimit(searchImages.totalHits);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchWord !== '') {
      fetchImagesAndUpdateState();
    }
  }, [page, per_page, searchWord]);

  const handleSearchImage = searchItem => {
    if (searchItem === '') {
      setCanFind(true);
      setSearch(null);
      setImages([]);
      return;
    }

    setSearchWord(searchItem);
    setPage(1);
    setImages([]);
  };

  const handleAddPage = () => {
    setPage(prevPage => prevPage + 1);
    setIsLoading(true);
  };

  const showModal = ({ largeImg, alt }) => {
    setModalOpen(true);
    setImageDetails({
      largeImg,
      alt,
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageDetails({});
  };

  return (
    <div className="App">
      <Searchbar handleSearchImage={handleSearchImage} />
      {error && (
        <p style={{ textAlign: 'center' }}>
          Whoops, something went wrong: {error.message}
        </p>
      )}
      {canFind && (
        <p style={{ textAlign: 'center' }}>
          Sorry, I couldn't find pictures for your entry or the input field is
          empty, please try again.
        </p>
      )}
      <ImageGallery>
        {images.length > 0 &&
          images.map(({ webformatURL, largeImageURL, tags }, i) => (
            <ImageGalleryItem
              key={i}
              img={webformatURL}
              largeImg={largeImageURL}
              alt={tags}
              showModal={showModal}
            />
          ))}
      </ImageGallery>
      {isLoading && <Loader />}
      {search && <Button handleAddPage={handleAddPage} />}
      {modalOpen && (
        <Modal
          close={closeModal}
          alt={imageDetails.alt}
          src={imageDetails.largeImg}
        />
      )}
    </div>
  );
};

export default App;
