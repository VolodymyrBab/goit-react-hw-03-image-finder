import React, { PureComponent } from 'react';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import { ThreeDots } from 'react-loader-spinner';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import Modal from 'components/Modal/Modal';
import css from './App.module.css';
import Button from './Button/Button';


export default class App extends PureComponent {
  state = {
    query: '',
    images: [],
    page: 1,
    error: null,
    loading: false,
    showModal: false,
    index: null,
  };

  saveSearchQuerry = (query) => {
    this.setState({ query });
    this.setState({page: 1})
  }

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.query;
    const nextQuery = this.state.query;
    

    if (prevQuery !== nextQuery) {
      this.setState({loading: true });

      fetch(`https://pixabay.com/api/?q=${nextQuery}&page=${this.state.page}&key=40818387-04943edebb074dd6464bb45f5&image_type=photo&orientation=horizontal&per_page=12`)
        .then(response => {
          if (response.ok) {
            return response.json()
          }
        }).then(images => this.setState({ images: images.hits }))
        .catch(error => this.setState({ error }))
        .finally(() => { this.setState({ loading: false }); this.setState(prevState => ({ page: prevState.page + 1 })) });
      
    }
  }

  toggleModal = () => {this.setState(prevState => ({ showModal: !prevState.showModal }))}

  handleClick = () => {
    this.setState({ loading: true });
    
    fetch(`https://pixabay.com/api/?q=${this.state.query}&page=${this.state.page}&key=40818387-04943edebb074dd6464bb45f5&image_type=photo&orientation=horizontal&per_page=12`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      }).then(images => this.setState(prevState => ({ images: [...prevState.images, ...images.hits] })))
      .catch(error => this.setState({ error }))
      .finally(() => { this.setState({ loading: false }); this.setState(prevState => ({ page: prevState.page + 1 })) });
  }

  getIndex = (index) => {
  this.setState({index})
  }

  render() {

    const { images, loading, showModal, index } = this.state;
    
    return <div className={css.App}>
      <SearchBar onSubmit={this.saveSearchQuerry}></SearchBar>

      
        
      <ImageGallery>
        {images.map((image, index) => {
          return < ImageGalleryItem onClick={this.toggleModal} getIndex={this.getIndex} key={image.id} index={index} image={image.webformatURL} tags={image.tags} />
        })}
      </ImageGallery>
      
      {loading && <ThreeDots
          height="300"
          width="300"
          radius="9"
          color="#3f51b5"
          ariaLabel="three-dots-loading"
          wrapperStyle={{justifyContent: 'center'}}
          wrapperClassName=""
          visible={true} />}

      {images.length >= 12 && <Button onClick={this.handleClick} />}

      {showModal && <Modal onClose={this.toggleModal}><img src={images[index].largeImageURL} alt={images[index].tags}/></Modal>}
    </div>
  }
}
