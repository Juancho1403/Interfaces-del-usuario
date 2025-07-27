import React from 'react';
import { Link } from 'react-router-dom';
import destination1 from '../assets/destination-1.jpg';
import destination2 from '../assets/destination-2.jpg';
import destination3 from '../assets/destination-3.jpg';
import destination4 from '../assets/destination-4.jpg';
import destination5 from '../assets/destination-5.jpg';
import destination6 from '../assets/destination-6.jpg';

const destinations = [
  { name: 'United States', cities: 100, img: destination1 },
  { name: 'United Kingdom', cities: 100, img: destination2 },
  { name: 'Australia', cities: 100, img: destination3 },
  { name: 'India', cities: 100, img: destination4 },
  { name: 'South Africa', cities: 100, img: destination5 },
  { name: 'Indonesia', cities: 100, img: destination6 },
];

const Destination = () => {
  return (
    <>
      
      {/* Header Start */}
      <div className="container-fluid page-header">
        <div className="container">
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
            <h3 className="display-4 text-white text-uppercase">Destination</h3>
            <div className="d-inline-flex text-white">
              <p className="m-0 text-uppercase">
                <Link className="text-white" to="/">Home</Link>
              </p>
              <i className="fa fa-angle-double-right pt-1 px-3"></i>
              <p className="m-0 text-uppercase">Destination</p>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}

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

      {/* Destination Start */}
      <div className="container-fluid py-5">
        <div className="container pt-5 pb-3">
          <div className="text-center mb-3 pb-3">
            <h6 className="text-primary text-uppercase" style={{ letterSpacing: 5 }}>Destination</h6>
            <h1>Explore Top Destination</h1>
          </div>
          <div className="row">
            {destinations.map((destination, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div className="destination-item position-relative overflow-hidden mb-2">
                  <img className="img-fluid" src={destination.img} alt={destination.name} />
                  <Link className="destination-overlay text-white text-decoration-none" to="#">
                    <h5 className="text-white">{destination.name}</h5>
                    <span>{destination.cities} Cities</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Destination End */}

      {/* Footer Start */}
      <div className="container-fluid bg-dark text-white-50 py-5 px-sm-3 px-lg-5" style={{ marginTop: 90 }}>
        <div className="row pt-5">
          <div className="col-lg-3 col-md-6 mb-5">
            <Link to="/" className="navbar-brand">
              <h1 className="text-primary"><span className="text-white">TRAVEL</span>ER</h1>
            </Link>
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
              <Link className="text-white-50 mb-2" to="/about"><i className="fa fa-angle-right mr-2"></i>About</Link>
              <Link className="text-white-50 mb-2" to="/destination"><i className="fa fa-angle-right mr-2"></i>Destination</Link>
              <Link className="text-white-50 mb-2" to="/service"><i className="fa fa-angle-right mr-2"></i>Services</Link>
              <Link className="text-white-50 mb-2" to="/package"><i className="fa fa-angle-right mr-2"></i>Packages</Link>
              <Link className="text-white-50 mb-2" to="/guide"><i className="fa fa-angle-right mr-2"></i>Guides</Link>
              <Link className="text-white-50 mb-2" to="/testimonial"><i className="fa fa-angle-right mr-2"></i>Testimonial</Link>
              <Link className="text-white-50" to="/blog"><i className="fa fa-angle-right mr-2"></i>Blog</Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-5">
            <h5 className="text-white text-uppercase mb-4" style={{ letterSpacing: 5 }}>Usefull Links</h5>
            <div className="d-flex flex-column justify-content-start">
              <Link className="text-white-50 mb-2" to="/about"><i className="fa fa-angle-right mr-2"></i>About</Link>
              <Link className="text-white-50 mb-2" to="/destination"><i className="fa fa-angle-right mr-2"></i>Destination</Link>
              <Link className="text-white-50 mb-2" to="/service"><i className="fa fa-angle-right mr-2"></i>Services</Link>
              <Link className="text-white-50 mb-2" to="/package"><i className="fa fa-angle-right mr-2"></i>Packages</Link>
              <Link className="text-white-50 mb-2" to="/guide"><i className="fa fa-angle-right mr-2"></i>Guides</Link>
              <Link className="text-white-50 mb-2" to="/testimonial"><i className="fa fa-angle-right mr-2"></i>Testimonial</Link>
              <Link className="text-white-50" to="/blog"><i className="fa fa-angle-right mr-2"></i>Blog</Link>
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
      <div className="container-fluid bg-dark text-white border-top py-4 px-sm-3 px-md-5" style={{ borderColor: 'rgba(256, 256, 256, .1) !important' }}>
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

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="fa fa-angle-double-up"></i></a>
    </>
  );
};

export default Destination; 