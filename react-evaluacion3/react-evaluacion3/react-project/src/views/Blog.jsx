import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../api';
import blog1 from '../assets/blog-1.jpg';
import blog2 from '../assets/blog-2.jpg';
import blog3 from '../assets/blog-3.jpg';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error al cargar posts del blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="container-fluid py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
          <p className="mt-3">Cargando blog...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid page-header">
        <div className="container">
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
            <h3 className="display-4 text-white text-uppercase">Blog</h3>
            <div className="d-inline-flex text-white">
              <Link className="text-white" to="/">Home</Link>
              <i className="fa fa-angle-double-right pt-1 px-3"></i>
              <span className="m-0 text-uppercase">Blog</span>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Blog Start */}
      <div className="container-fluid py-5">
        <div className="container pt-5 pb-3">
          <div className="text-center mb-3 pb-3">
            <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Blog</h6>
            <h1>Últimas Publicaciones</h1>
          </div>
          <div className="row pb-3">
            {blogPosts.map((post, index) => (
              <div key={post.id || index} className="col-lg-4 mb-4">
                <div className="blog-item">
                  <div className="position-relative overflow-hidden">
                    <img className="img-fluid w-100" src={post.image || blog1} alt={post.title} />
                  </div>
                  <div className="bg-white p-4">
                    <div className="d-flex mb-3">
                      <small className="mr-2"><i className="fa fa-calendar-alt text-primary mr-1"></i>{post.date}</small>
                      <small className="mr-2"><i className="fa fa-folder text-primary mr-1"></i>Blog</small>
                    </div>
                    <a className="h5 m-0" href="#">{post.title}</a>
                    <p className="mt-3">{post.excerpt}</p>
                    <a className="btn btn-primary" href="#">Leer más</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Blog End */}
    </>
  );
};

export default Blog; 