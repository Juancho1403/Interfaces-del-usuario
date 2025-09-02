import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import carousel1 from '../assets/carousel-1.jpg';
import carousel2 from '../assets/carousel-2.jpg';
import about from '../assets/about.jpg';
import about1 from '../assets/about-1.jpg';
import about2 from '../assets/about-2.jpg';
import team1 from '../assets/team-1.jpg';
import team2 from '../assets/team-2.jpg';
import team3 from '../assets/team-3.jpg';
import team4 from '../assets/team-4.jpg';
import testimonial1 from '../assets/testimonial-1.jpg';
import testimonial2 from '../assets/testimonial-2.jpg';
import testimonial3 from '../assets/testimonial-3.jpg';
import testimonial4 from '../assets/testimonial-4.jpg';
import blog1 from '../assets/blog-1.jpg';
import blog2 from '../assets/blog-2.jpg';
import blog3 from '../assets/blog-3.jpg';
import destination1 from '../assets/destination-1.jpg';
import destination2 from '../assets/destination-2.jpg';
import destination3 from '../assets/destination-3.jpg';
import destination4 from '../assets/destination-4.jpg';
import destination5 from '../assets/destination-5.jpg';
import destination6 from '../assets/destination-6.jpg';
import package1 from '../assets/package-1.jpg';
import package2 from '../assets/package-2.jpg';
import package3 from '../assets/package-3.jpg';
import package4 from '../assets/package-4.jpg';
import package5 from '../assets/package-5.jpg';
import package6 from '../assets/package-6.jpg';
import { getAboutData } from '../api';
import { useNavigate } from 'react-router-dom';
import SplashAnimacion3D from './SplashAnimacion3D';
import { useCarousel } from '../context/CarouselContext';
// import ConnectionTest from '../components/ConnectionTest';

const destinations = [
  { name: 'United States', cities: 100, img: destination1 },
  { name: 'United Kingdom', cities: 100, img: destination2 },
  { name: 'Australia', cities: 100, img: destination3 },
  { name: 'India', cities: 100, img: destination4 },
  { name: 'South Africa', cities: 100, img: destination5 },
  { name: 'Indonesia', cities: 100, img: destination6 },
];

const services = [
  { icon: 'fa fa-route', title: 'Travel Guide', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
  { icon: 'fa fa-ticket-alt', title: 'Ticket Booking', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
  { icon: 'fa fa-hotel', title: 'Hotel Booking', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
];

const packages = [
  { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: package1 },
  { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: package2 },
  { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: package3 },
  { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: package4 },
  { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: package5 },
  { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350, img: package6 },
];

const guides = [
  { img: team1 },
  { img: team2 },
  { img: team3 },
  { img: team4 },
];

const testimonials = [
  { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: testimonial1 },
  { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: testimonial2 },
  { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: testimonial3 },
  { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam', img: testimonial4 },
];

const blogs = [
  { img: blog1 },
  { img: blog2 },
  { img: blog3 },
];

const Home = (props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { carouselImages, carouselVideos, removeCarouselImage, removeCarouselVideo } = useCarousel();

  useEffect(() => {
    if (!localStorage.getItem('splashShown')) {
      localStorage.setItem('splashShown', 'true');
      window.location.href = '/animacion_b3.html';
    }
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutData();
        setAboutData(data);
      } catch (error) {
        console.error('Error al cargar datos de About:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 15000); // 15 segundos
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setShowWelcome(true);
    navigate('/');
  };

  return (
    <>
      {showSplash ? (
        <div style={{width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 9999, background: '#1a1a1a'}}>
          <iframe
            src="/animacion_b3.html"
            title="Animación Splash"
            style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
            allowFullScreen
          />
        </div>
      ) : (
        <>
          {/* Mensaje de bienvenida y botón de inicio de sesión */}
          {showWelcome && (
            <div className="container py-5">
              {!token ? (
                <div className="alert alert-info text-center mb-4">
                  <h4>¡Bienvenido a Traveler!</h4>
                  <p>Para acceder a todas las funciones, por favor <b>inicia sesión</b> o regístrate.</p>
                  <button className="btn btn-success mt-2" onClick={() => navigate('/login')}>Iniciar Sesión</button>
                </div>
              ) : (
                <div className="alert alert-success text-center mb-4">
                  <h4>¡Hola {role === 'admin' ? 'Administrador' : 'Usuario'}!</h4>
                  <p>Has iniciado sesión correctamente.</p>
                  <button className="btn btn-danger mt-2" onClick={handleLogout}>Salir de sesión</button>
                </div>
              )}
            </div>
          )}
          {/* Test de Conexión */}
          {/* <ConnectionTest /> */}

          {/* Navbar Start */}
          {/* Aquí deberías importar y usar tu componente Navbar si lo tienes */}

          {/* Carousel Start */}
          <div className="container-fluid p-0">
            <style>{`
              .simple-carousel .carousel-indicators [data-bs-target] { width: 10px; height: 10px; border-radius: 50%; }
              .simple-carousel .carousel-indicators .active { background-color: #00b894; }
              /* Controles personalizados */
              .simple-carousel .carousel-control-prev, 
              .simple-carousel .carousel-control-next { width: 64px; opacity: 1; transition: transform .2s ease; }
              .simple-carousel .carousel-control-prev:hover, 
              .simple-carousel .carousel-control-next:hover { transform: scale(1.05); }
              .simple-carousel .carousel-control-prev-icon, 
              .simple-carousel .carousel-control-next-icon {
                width: 44px; height: 44px; border-radius: 50%; background-color: rgba(0,0,0,0.5); box-shadow: 0 8px 16px rgba(0,0,0,0.2), 0 0 0 2px rgba(0,184,148,0.8);
                background-size: 60% 60%; background-position: center; background-repeat: no-repeat; 
              }
              .simple-carousel .carousel-control-prev-icon { 
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' stroke='%23ffffff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M10.5 2.5 4 8l6.5 5.5'/%3e%3c/svg%3e");
              }
              .simple-carousel .carousel-control-next-icon { 
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' stroke='%23ffffff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M5.5 2.5 12 8l-6.5 5.5'/%3e%3c/svg%3e");
              }
              .simple-carousel .carousel-control-prev-icon:hover, 
              .simple-carousel .carousel-control-next-icon:hover { background-color: rgba(0,184,148,0.9); box-shadow: 0 10px 18px rgba(0,184,148,0.35); }
              .card-carousel { background:#ffffff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08); overflow:hidden; }
              .card-carousel .caption { background: linear-gradient(90deg, #00b894, #0984e3); -webkit-background-clip:text; color:transparent; font-weight:700; }
              .overlay-action { position:absolute; top:12px; right:12px; }
            `}</style>
            <Carousel 
              id="header-carousel" 
              className="simple-carousel"
              interval={5000}
              controls={true}
              indicators={true}
              fade={true}
            >
              {carouselImages.map((image, index) => (
                <Carousel.Item key={image.id}>
                  <img className="w-100" src={image.src} alt={image.name} />
                  <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
                    <div className="p-3" style={{ maxWidth: 900 }}>
                      <h4 className="text-white text-uppercase mb-md-3">Tours & Travel</h4>
                      <h1 className="display-3 text-white mb-md-4">
                        {index === 0 ? "Let's Discover The World Together" : "Discover Amazing Places With Us"}
                      </h1>
                      <a href="#" className="btn btn-primary py-md-3 px-md-5 mt-2">Book Now</a>
                    </div>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          {/* Carousel End */}

          {/* Video Carousel Start (simple) */}
          {carouselVideos.length > 0 && (
            <div className="container-fluid py-5">
              <div className="container">
                <div className="text-center mb-4">
                  <h2 className="text-primary">Videos</h2>
                  <p className="text-muted">Nuestros videos más recientes</p>
                </div>
                <Carousel interval={6000} controls indicators className="simple-carousel card-carousel">
                  {carouselVideos.map((video) => (
                    <Carousel.Item key={video.id}>
                      <div className="row justify-content-center">
                        <div className="col-lg-10 position-relative">
                          <button
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: 12, right: 12, opacity: 0.9 }}
                            onClick={() => removeCarouselVideo(video.id)}
                            title="Eliminar del carrusel"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                          <video className="w-100 rounded shadow" controls style={{ border: '4px solid #00b894' }}>
                            <source src={video.src} type={video.info?.type || 'video/mp4'} />
                            Tu navegador no soporta el elemento de video.
                          </video>
                          <div className="text-center mt-3">
                            <h5 className="caption">{video.name}</h5>
                          </div>
                        </div>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>
          )}
          {/* Video Carousel End */}

          {/* Image Carousel Start (simple adicional bajo el header) */}
          {carouselImages.length > 0 && (
            <div className="container-fluid py-5">
              <div className="container">
                <div className="text-center mb-4">
                  <h2 className="text-success">Imágenes</h2>
                  <p className="text-muted">Nuestras imágenes destacadas</p>
                </div>
                <Carousel interval={5000} controls indicators className="simple-carousel card-carousel">
                  {carouselImages.map((image) => (
                    <Carousel.Item key={image.id}>
                      <div className="position-relative">
                        {!image.isDefault && (
                          <button
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: 12, right: 12, opacity: 0.9 }}
                            onClick={() => removeCarouselImage(image.id)}
                            title="Eliminar del carrusel"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                        <img className="d-block w-100 rounded shadow" src={image.src} alt={image.name} style={{ border: '4px solid #0984e3' }} />
                      </div>
                      <Carousel.Caption>
                        <h5 className="caption">{image.name}</h5>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>
          )}
          {/* Image Carousel End */}

          {/* Booking Start */}
          <div className="container-fluid booking mt-5 pb-5">
            <div className="container pb-5">
              <div className="bg-light shadow" style={{ padding: 30 }}>
                <div className="row align-items-center" style={{ minHeight: 60 }}>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="mb-3 mb-md-0">
                          <select className="custom-select px-4" style={{ height: 47 }}>
                            <option defaultValue>Destination</option>
                            <option value="1">Destination 1</option>
                            <option value="2">Destination 2</option>
                            <option value="3">Destination 3</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3 mb-md-0">
                          <div className="date" id="date1" data-target-input="nearest">
                            <input type="text" className="form-control p-4 datetimepicker-input" placeholder="Depart Date" data-target="#date1" data-toggle="datetimepicker" />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3 mb-md-0">
                          <div className="date" id="date2" data-target-input="nearest">
                            <input type="text" className="form-control p-4 datetimepicker-input" placeholder="Return Date" data-target="#date2" data-toggle="datetimepicker" />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3 mb-md-0">
                          <select className="custom-select px-4" style={{ height: 47 }}>
                            <option defaultValue>Duration</option>
                            <option value="1">Duration 1</option>
                            <option value="2">Duration 2</option>
                            <option value="3">Duration 3</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-primary btn-block" type="submit" style={{ height: 47, marginTop: -2 }}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Booking End */}

          {/* About Start */}
          <div className="container-fluid py-5">
            <div className="container pt-5">
              <div className="row">
                <div className="col-lg-6" style={{ minHeight: 500 }}>
                  <div className="position-relative h-100">
                    <img className="position-absolute w-100 h-100" src={about} style={{ objectFit: 'cover' }} alt="about" />
                  </div>
                </div>
                <div className="col-lg-6 pt-5 pb-lg-5">
                  <div className="about-text bg-white p-4 p-lg-5 my-lg-5">
                    <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>About Us</h6>
                    <h1 className="mb-3">We Provide Best Tour Packages In Your Budget</h1>
                    <p>Dolores lorem lorem ipsum sit et ipsum. Sadip sea amet diam dolore sed et. Sit rebum labore sit sit ut vero no sit. Et elitr stet dolor sed sit et sed ipsum et kasd ut. Erat duo eos et erat sed diam duo</p>
                    <div className="row mb-4">
                      <div className="col-6">
                        <img className="img-fluid" src={about1} alt="about-1" />
                      </div>
                      <div className="col-6">
                        <img className="img-fluid" src={about2} alt="about-2" />
                      </div>
                    </div>
                    <a href="#" className="btn btn-primary mt-1">Book Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* About End */}

          {/* Feature Start */}
          <div className="container-fluid pb-5">
            <div className="container pb-5">
              <div className="row">
                <div className="col-md-4">
                  <div className="d-flex mb-4 mb-lg-0">
                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary mr-3" style={{ height: 100, width: 100 }}>
                      <i className="fa fa-2x fa-money-check-alt text-white"></i>
                    </div>
                    <div className="d-flex flex-column">
                      <h5>Competitive Pricing</h5>
                      <p className="m-0">Magna sit magna dolor duo dolor labore rebum amet elitr est diam sea</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex mb-4 mb-lg-0">
                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary mr-3" style={{ height: 100, width: 100 }}>
                      <i className="fa fa-2x fa-award text-white"></i>
                    </div>
                    <div className="d-flex flex-column">
                      <h5>Best Services</h5>
                      <p className="m-0">Magna sit magna dolor duo dolor labore rebum amet elitr est diam sea</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex mb-4 mb-lg-0">
                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary mr-3" style={{ height: 100, width: 100 }}>
                      <i className="fa fa-2x fa-globe text-white"></i>
                    </div>
                    <div className="d-flex flex-column">
                      <h5>Worldwide Coverage</h5>
                      <p className="m-0">Magna sit magna dolor duo dolor labore rebum amet elitr est diam sea</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Feature End */}

          {/* Destination Start */}
          <div className="container-fluid py-5">
            <div className="container pt-5 pb-3">
              <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Destination</h6>
                <h1>Explore Top Destination</h1>
              </div>
              <div className="row">
                {destinations.map((dest, i) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={i}>
                    <div className="destination-item position-relative overflow-hidden mb-2">
                      <img className="img-fluid" src={dest.img} alt="" />
                      <a className="destination-overlay text-white text-decoration-none" href="#">
                        <h5 className="text-white">{dest.name}</h5>
                        <span>{dest.cities} Cities</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Destination End */}

          {/* Service Start */}
          <div className="container-fluid py-5">
            <div className="container pt-5 pb-3">
              <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Services</h6>
                <h1>Tours & Travel Services</h1>
              </div>
              <div className="row">
                {services.map((service, i) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={i}>
                    <div className="service-item bg-white text-center mb-2 py-5 px-4">
                      <i className={`${service.icon} fa-2x mx-auto mb-4`}></i>
                      <h5 className="mb-2">{service.title}</h5>
                      <p className="m-0">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Service End */}

          {/* Packages Start */}
          <div className="container-fluid py-5">
            <div className="container pt-5 pb-3">
              <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Packages</h6>
                <h1>Pefect Tour Packages</h1>
              </div>
              <div className="row">
                {packages.map((pkg, i) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={i}>
                    <div className="package-item bg-white mb-2">
                      <img className="img-fluid" src={pkg.img} alt="" />
                      <div className="p-4">
                        <div className="d-flex justify-content-between mb-3">
                          <small className="m-0"><i className="fa fa-map-marker-alt text-primary mr-2"></i>{pkg.country}</small>
                          <small className="m-0"><i className="fa fa-calendar-alt text-primary mr-2"></i>{pkg.days} days</small>
                          <small className="m-0"><i className="fa fa-user text-primary mr-2"></i>{pkg.people} Person</small>
                        </div>
                        <a className="h5 text-decoration-none" href="#">{pkg.title}</a>
                        <div className="border-top mt-4 pt-4">
                          <div className="d-flex justify-content-between">
                            <h6 className="m-0"><i className="fa fa-star text-primary mr-2"></i>{pkg.rating} <small>({pkg.reviews})</small></h6>
                            <h5 className="m-0">${pkg.price}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Packages End */}

          {/* Registration Start */}
          <div className="container-fluid bg-registration py-5" style={{ margin: '90px 0' }}>
            <div className="container py-5">
              <div className="row align-items-center">
                <div className="col-lg-7 mb-5 mb-lg-0">
                  <div className="mb-4">
                    <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Mega Offer</h6>
                    <h1 className="text-white"><span className="text-primary">30% OFF</span> For Honeymoon</h1>
                  </div>
                  <p className="text-white">Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo. Erat justo sed sed diam. Ea et erat ut sed diam sea ipsum est dolor</p>
                  <ul className="list-inline text-white m-0">
                    <li className="py-2"><i className="fa fa-check text-primary mr-3"></i>Labore eos amet dolor amet diam</li>
                    <li className="py-2"><i className="fa fa-check text-primary mr-3"></i>Etsea et sit dolor amet ipsum</li>
                    <li className="py-2"><i className="fa fa-check text-primary mr-3"></i>Diam dolor diam elitripsum vero.</li>
                  </ul>
                </div>
                <div className="col-lg-5">
                  <div className="card border-0">
                    <div className="card-header bg-primary text-center p-4">
                      <h1 className="text-white m-0">Sign Up Now</h1>
                    </div>
                    <div className="card-body rounded-bottom bg-white p-5">
                      <form>
                        <div className="form-group">
                          <input type="text" className="form-control p-4" placeholder="Your name" required />
                        </div>
                        <div className="form-group">
                          <input type="email" className="form-control p-4" placeholder="Your email" required />
                        </div>
                        <div className="form-group">
                          <select className="custom-select px-4" style={{ height: 47 }}>
                            <option defaultValue>Select a destination</option>
                            <option value="1">destination 1</option>
                            <option value="2">destination 2</option>
                            <option value="3">destination 3</option>
                          </select>
                        </div>
                        <div>
                          <button className="btn btn-primary btn-block py-3" type="submit">Sign Up Now</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Registration End */}

          {/* Team Start */}
          <div className="container-fluid py-5">
            <div className="container pt-5 pb-3">
              <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Guides</h6>
                <h1>Our Travel Guides</h1>
              </div>
              <div className="row">
                {guides.map((guide, i) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 pb-2" key={i}>
                    <div className="team-item bg-white mb-4">
                      <div className="team-img position-relative overflow-hidden">
                        <img className="img-fluid w-100" src={guide.img} alt="" />
                        <div className="team-social">
                          <a className="btn btn-outline-primary btn-square" href="#"><i className="fab fa-twitter"></i></a>
                          <a className="btn btn-outline-primary btn-square" href="#"><i className="fab fa-facebook-f"></i></a>
                          <a className="btn btn-outline-primary btn-square" href="#"><i className="fab fa-instagram"></i></a>
                          <a className="btn btn-outline-primary btn-square" href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                      </div>
                      <div className="text-center py-4">
                        <h5 className="text-truncate">Guide Name</h5>
                        <p className="m-0">Designation</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Team End */}

          {/* Testimonial Start */}
          <div className="container-fluid py-5">
            <div className="container py-5">
              <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Testimonial</h6>
                <h1>What Say Our Clients</h1>
              </div>
              <div className="d-flex flex-column align-items-center">
                <div className="text-center pb-4">
                  <img className="img-fluid mx-auto" src={testimonials[testimonialIndex].img} style={{ width: 100, height: 100 }} alt="testimonial" />
                  <div className="testimonial-text bg-white p-4 mt-n5">
                    <p className="mt-5">{testimonials[testimonialIndex].text}</p>
                    <h5 className="text-truncate">Client Name</h5>
                    <span>Profession</span>
                  </div>
                </div>
                <div className="mt-3">
                  <button className="btn btn-outline-primary mx-1" onClick={prevTestimonial}>&lt;</button>
                  <button className="btn btn-outline-primary mx-1" onClick={nextTestimonial}>&gt;</button>
                </div>
              </div>
            </div>
          </div>
          {/* Testimonial End */}

          {/* Blog Start */}
          <div className="container-fluid py-5">
            <div className="container pt-5 pb-3">
              <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Our Blog</h6>
                <h1>Latest From Our Blog</h1>
              </div>
              <div className="row pb-3">
                {blogs.map((blog, i) => (
                  <div className="col-lg-4 col-md-6 mb-4 pb-2" key={i}>
                    <div className="blog-item">
                      <div className="position-relative">
                        <img className="img-fluid w-100" src={blog.img} alt="" />
                        <div className="blog-date">
                          <h6 className="font-weight-bold mb-n1">01</h6>
                          <small className="text-white text-uppercase">Jan</small>
                        </div>
                      </div>
                      <div className="bg-white p-4">
                        <div className="d-flex mb-2">
                          <a className="text-primary text-uppercase text-decoration-none" href="#">Admin</a>
                          <span className="text-primary px-2">|</span>
                          <a className="text-primary text-uppercase text-decoration-none" href="#">Tours & Travel</a>
                        </div>
                        <a className="h5 m-0 text-decoration-none" href="#">Dolor justo sea kasd lorem clita justo diam amet</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Blog End */}

          {/* Footer Start */}
          <div className="container-fluid bg-dark text-white-50 py-5 px-sm-3 px-lg-5" style={{ marginTop: 90 }}>
            <div className="row pt-5">
              <div className="col-lg-3 col-md-6 mb-5">
                <a href="#" className="navbar-brand">
                  <h1 className="text-primary"><span className="text-white">TRAVEL</span>ER</h1>
                </a>
                <p>Sed ipsum clita tempor ipsum ipsum amet sit ipsum lorem amet labore rebum lorem ipsum dolor. No sed vero lorem dolor dolor</p>
                <h6 className="text-white text-uppercase mt-4 mb-3" style={{ letterSpacing: 5 }}>Follow Us</h6>
                <div className="d-flex justify-content-start">
                  <a className="btn btn-outline-primary btn-square mr-2" href="#"><i className="fab fa-twitter"></i></a>
                  <a className="btn btn-outline-primary btn-square mr-2" href="#"><i className="fab fa-facebook-f"></i></a>
                  <a className="btn btn-outline-primary btn-square mr-2" href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a className="btn btn-outline-primary btn-square" href="#"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-5">
                <h5 className="text-white text-uppercase mb-4" style={{ letterSpacing: 5 }}>Our Services</h5>
                <div className="d-flex flex-column justify-content-start">
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>About</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Destination</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Services</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Packages</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Guides</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Testimonial</a>
                  <a className="text-white-50" href="#"><i className="fa fa-angle-right mr-2"></i>Blog</a>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-5">
                <h5 className="text-white text-uppercase mb-4" style={{ letterSpacing: 5 }}>Usefull Links</h5>
                <div className="d-flex flex-column justify-content-start">
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>About</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Destination</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Services</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Packages</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Guides</a>
                  <a className="text-white-50 mb-2" href="#"><i className="fa fa-angle-right mr-2"></i>Testimonial</a>
                  <a className="text-white-50" href="#"><i className="fa fa-angle-right mr-2"></i>Blog</a>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-5">
                <h5 className="text-white text-uppercase mb-4" style={{ letterSpacing: 5 }}>Contact Us</h5>
                <p><i className="fa fa-map-marker-alt mr-2"></i>123 Street, New York, USA</p>
                <p><i className="fa fa-phone-alt mr-2"></i>+012 345 67890</p>
                <p><i className="fa fa-envelope mr-2"></i>info@example.com</p>
                <h6 className="text-white text-uppercase mt-4 mb-3" style={{ letterSpacing: 5 }}>Newsletter</h6>
                <div className="w-100">
                  <div className="input-group">
                    <input type="text" className="form-control border-light" style={{ padding: 25 }} placeholder="Your Email" />
                    <div className="input-group-append">
                      <button className="btn btn-primary px-3">Sign Up</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid bg-dark text-white border-top py-4 px-sm-3 px-md-5" style={{ borderColor: 'rgba(256, 256, 256, .1)' }}>
            <div className="row">
              <div className="col-lg-6 text-center text-md-left mb-3 mb-md-0">
                <p className="m-0 text-white-50">Copyright &copy; <a href="#">Domain</a>. All Rights Reserved.</p>
              </div>
              <div className="col-lg-6 text-center text-md-right">
                <p className="m-0 text-white-50">Designed by <a href="https://htmlcodex.com">HTML Codex</a></p>
              </div>
            </div>
          </div>
          {/* Footer End */}
        </>
      )}
    </>
  );
};

export default Home; 