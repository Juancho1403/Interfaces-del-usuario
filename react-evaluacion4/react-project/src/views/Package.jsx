import React from 'react';
import package1 from '../assets/package-1.jpg';
import package2 from '../assets/package-2.jpg';
import package3 from '../assets/package-3.jpg';
import package4 from '../assets/package-4.jpg';
import package5 from '../assets/package-5.jpg';
import package6 from '../assets/package-6.jpg';
import { Link } from 'react-router-dom';

const packages = [
  { img: package1, country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
  { img: package2, country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
  { img: package3, country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
  { img: package4, country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
  { img: package5, country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
  { img: package6, country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
];

const Package = () => (
  <>
    {/* Header Start */}
    <div className="container-fluid page-header">
      <div className="container">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
          <h3 className="display-4 text-white text-uppercase">Packages</h3>
          <div className="d-inline-flex text-white">
            <Link className="text-white" to="/">Home</Link>
            <i className="fa fa-angle-double-right pt-1 px-3"></i>
            <span className="m-0 text-uppercase">Packages</span>
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
                <img className="img-fluid" src={pkg.img} alt="package" />
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
  </>
);

export default Package; 