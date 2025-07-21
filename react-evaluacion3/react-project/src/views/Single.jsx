import React from 'react';
import { Link } from 'react-router-dom';
import blog1 from '../assets/blog-1.jpg';
import blog2 from '../assets/blog-2.jpg';
import blog3 from '../assets/blog-3.jpg';
import blog100x100 from '../assets/blog-100x100.jpg';
import user from '../assets/user.jpg';

const categories = [
  { name: 'Web Design', count: 150 },
  { name: 'Web Development', count: 131 },
  { name: 'Online Marketing', count: 78 },
  { name: 'Keyword Research', count: 56 },
  { name: 'Email Marketing', count: 98 },
];

const recentPosts = [
  { title: 'Diam lorem dolore justo eirmod lorem dolore', date: 'Jan 01, 2050', img: blog100x100 },
  { title: 'Diam lorem dolore justo eirmod lorem dolore', date: 'Jan 01, 2050', img: blog100x100 },
  { title: 'Diam lorem dolore justo eirmod lorem dolore', date: 'Jan 01, 2050', img: blog100x100 },
];

const tags = ['Design', 'Development', 'Marketing', 'SEO', 'Writing', 'Consulting'];

const Single = () => {
  return (
    <>
      
      {/* Header Start */}
      <div className="container-fluid page-header">
        <div className="container">
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
            <h3 className="display-4 text-white text-uppercase">Blog Detail</h3>
            <div className="d-inline-flex text-white">
              <p className="m-0 text-uppercase">
                <Link className="text-white" to="/">Home</Link>
              </p>
              <i className="fa fa-angle-double-right pt-1 px-3"></i>
              <p className="m-0 text-uppercase">Blog Detail</p>
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

      {/* Blog Start */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              {/* Blog Detail Start */}
              <div className="pb-3">
                <div className="blog-item">
                  <div className="position-relative">
                    <img className="img-fluid w-100" src={blog1} alt="Blog" />
                    <div className="blog-date">
                      <h6 className="font-weight-bold mb-n1">01</h6>
                      <small className="text-white text-uppercase">Jan</small>
                    </div>
                  </div>
                </div>
                <div className="bg-white mb-3" style={{ padding: 30 }}>
                  <div className="d-flex mb-3">
                    <a className="text-primary text-uppercase text-decoration-none" href="#!">Admin</a>
                    <span className="text-primary px-2">|</span>
                    <a className="text-primary text-uppercase text-decoration-none" href="#!">Tours & Travel</a>
                  </div>
                  <h2 className="mb-3">Dolor justo sea kasd lorem clita justo diam amet</h2>
                  <p>Sadipscing labore amet rebum est et justo gubergren. Et eirmod ipsum sit diam ut
                    magna lorem. Nonumy vero labore lorem sanctus rebum et lorem magna kasd, stet
                    amet magna accusam consetetur eirmod. Kasd accusam sit ipsum sadipscing et at at
                    sanctus et. Ipsum sit gubergren dolores et, consetetur justo invidunt at et
                    aliquyam ut et vero clita. Diam sea sea no sed dolores diam nonumy, gubergren
                    sit stet no diam kasd vero.</p>
                  <p>Voluptua est takimata stet invidunt sed rebum nonumy stet, clita aliquyam dolores
                    vero stet consetetur elitr takimata rebum sanctus. Sit sed accusam stet sit
                    nonumy kasd diam dolores, sanctus lorem kasd duo dolor dolor vero sit et. Labore
                    ipsum duo sanctus amet eos et. Consetetur no sed et aliquyam ipsum justo et,
                    clita lorem sit vero amet amet est dolor elitr, stet et no diam sit. Dolor erat
                    justo dolore sit invidunt.</p>
                  <h4 className="mb-3">Est dolor lorem et ea</h4>
                  <img className="img-fluid w-50 float-left mr-4 mb-2" src={blog2} alt="Blog" />
                  <p>Diam dolor est labore duo invidunt ipsum clita et, sed et lorem voluptua tempor
                    invidunt at est sanctus sanctus. Clita dolores sit kasd diam takimata justo diam
                    lorem sed. Magna amet sed rebum eos. Clita no magna no dolor erat diam tempor
                    rebum consetetur, sanctus labore sed nonumy diam lorem amet eirmod. No at tempor
                    sea diam kasd, takimata ea nonumy elitr sadipscing gubergren erat. Gubergren at
                    lorem invidunt sadipscing rebum sit amet ut ut, voluptua diam dolores at
                    sadipscing stet. Clita dolor amet dolor ipsum vero ea ea eos. Invidunt sed diam
                    dolores takimata dolor dolore dolore sit. Sit ipsum erat amet lorem et, magna
                    sea at sed et eos. Accusam eirmod kasd lorem clita sanctus ut consetetur et. Et
                    duo tempor sea kasd clita ipsum et.</p>
                  <h5 className="mb-3">Est dolor lorem et ea</h5>
                  <img className="img-fluid w-50 float-right ml-4 mb-2" src={blog3} alt="Blog" />
                  <p>Diam dolor est labore duo invidunt ipsum clita et, sed et lorem voluptua tempor
                    invidunt at est sanctus sanctus. Clita dolores sit kasd diam takimata justo diam
                    lorem sed. Magna amet sed rebum eos. Clita no magna no dolor erat diam tempor
                    rebum consetetur, sanctus labore sed nonumy diam lorem amet eirmod. No at tempor
                    sea diam kasd, takimata ea nonumy elitr sadipscing gubergren erat. Gubergren at
                    lorem invidunt sadipscing rebum sit amet ut ut, voluptua diam dolores at
                    sadipscing stet. Clita dolor amet dolor ipsum vero ea ea eos. Invidunt sed diam
                    dolores takimata dolor dolore dolore sit. Sit ipsum erat amet lorem et, magna
                    sea at sed et eos. Accusam eirmod kasd lorem clita sanctus ut consetetur et. Et
                    duo tempor sea kasd clita ipsum et. Takimata kasd diam justo est eos erat
                    aliquyam et ut.</p>
                </div>
              </div>
              {/* Blog Detail End */}

              {/* Comment List Start */}
              <div className="bg-white" style={{ padding: 30, marginBottom: 30 }}>
                <h4 className="text-uppercase mb-4" style={{ letterSpacing: 5 }}>3 Comments</h4>
                <div className="media mb-4">
                  <img src={user} alt="User" className="img-fluid mr-3 mt-1" style={{ width: 45 }} />
                  <div className="media-body">
                    <h6><a href="#!">John Doe</a> <small><i>01 Jan 2045</i></small></h6>
                    <p>Diam amet duo labore stet elitr invidunt ea clita ipsum voluptua, tempor labore
                      accusam ipsum et no at. Kasd diam tempor rebum magna dolores sed sed eirmod ipsum.
                      Gubergren clita aliquyam consetetur sadipscing, at tempor amet ipsum diam tempor
                      consetetur at sit.</p>
                    <button className="btn btn-sm btn-outline-primary">Reply</button>
                  </div>
                </div>
                <div className="media">
                  <img src={user} alt="User" className="img-fluid mr-3 mt-1" style={{ width: 45 }} />
                  <div className="media-body">
                    <h6><a href="#!">John Doe</a> <small><i>01 Jan 2045</i></small></h6>
                    <p>Diam amet duo labore stet elitr invidunt ea clita ipsum voluptua, tempor labore
                      accusam ipsum et no at. Kasd diam tempor rebum magna dolores sed sed eirmod ipsum.
                      Gubergren clita aliquyam consetetur sadipscing, at tempor amet ipsum diam tempor
                      consetetur at sit.</p>
                    <button className="btn btn-sm btn-outline-primary">Reply</button>
                    <div className="media mt-4">
                      <img src={user} alt="User" className="img-fluid mr-3 mt-1" style={{ width: 45 }} />
                      <div className="media-body">
                        <h6><a href="#!">John Doe</a> <small><i>01 Jan 2045</i></small></h6>
                        <p>Diam amet duo labore stet elitr invidunt ea clita ipsum voluptua, tempor
                          labore accusam ipsum et no at. Kasd diam tempor rebum magna dolores sed sed
                          eirmod ipsum. Gubergren clita aliquyam consetetur sadipscing, at tempor amet
                          ipsum diam tempor consetetur at sit.</p>
                        <button className="btn btn-sm btn-outline-primary">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Comment List End */}

              {/* Comment Form Start */}
              <div className="bg-white mb-3" style={{ padding: 30 }}>
                <h4 className="text-uppercase mb-4" style={{ letterSpacing: 5 }}>Leave a comment</h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input type="text" className="form-control" id="name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" className="form-control" id="email" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input type="url" className="form-control" id="website" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" cols="30" rows="5" className="form-control"></textarea>
                  </div>
                  <div className="form-group mb-0">
                    <input type="submit" value="Leave a comment" className="btn btn-primary font-weight-semi-bold py-2 px-3" />
                  </div>
                </form>
              </div>
              {/* Comment Form End */}
            </div>

            <div className="col-lg-4 mt-5 mt-lg-0">
              {/* Author Bio */}
              <div className="d-flex flex-column text-center bg-white mb-5 py-5 px-4">
                <img src={user} className="img-fluid mx-auto mb-3" style={{ width: 100 }} alt="Author" />
                <h3 className="text-primary mb-3">John Doe</h3>
                <p>Conset elitr erat vero dolor ipsum et diam, eos dolor lorem, ipsum sit no ut est ipsum erat kasd amet elitr</p>
                <div className="d-flex justify-content-center">
                  <a className="text-primary px-2" href="#!"><i className="fab fa-facebook-f"></i></a>
                  <a className="text-primary px-2" href="#!"><i className="fab fa-twitter"></i></a>
                  <a className="text-primary px-2" href="#!"><i className="fab fa-linkedin-in"></i></a>
                  <a className="text-primary px-2" href="#!"><i className="fab fa-instagram"></i></a>
                  <a className="text-primary px-2" href="#!"><i className="fab fa-youtube"></i></a>
                </div>
              </div>

              {/* Search Form */}
              <div className="mb-5">
                <div className="bg-white" style={{ padding: 30 }}>
                  <div className="input-group">
                    <input type="text" className="form-control p-4" placeholder="Keyword" />
                    <div className="input-group-append">
                      <span className="input-group-text bg-primary border-primary text-white">
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category List */}
              <div className="mb-5">
                <h4 className="text-uppercase mb-4" style={{ letterSpacing: 5 }}>Categories</h4>
                <div className="bg-white" style={{ padding: 30 }}>
                  <ul className="list-inline m-0">
                    {categories.map((category, index) => (
                      <li key={index} className="mb-3 d-flex justify-content-between align-items-center">
                        <a className="text-dark" href="#!">
                          <i className="fa fa-angle-right text-primary mr-2"></i>{category.name}
                        </a>
                        <span className="badge badge-primary badge-pill">{category.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recent Post */}
              <div className="mb-5">
                <h4 className="text-uppercase mb-4" style={{ letterSpacing: 5 }}>Recent Post</h4>
                {recentPosts.map((post, index) => (
                  <a key={index} className="d-flex align-items-center text-decoration-none bg-white mb-3" href="#!">
                    <img className="img-fluid" src={post.img} alt="Recent Post" />
                    <div className="pl-3">
                      <h6 className="m-1">{post.title}</h6>
                      <small>{post.date}</small>
                    </div>
                  </a>
                ))}
              </div>

              {/* Tag Cloud */}
              <div className="mb-5">
                <h4 className="text-uppercase mb-4" style={{ letterSpacing: 5 }}>Tag Cloud</h4>
                <div className="d-flex flex-wrap m-n1">
                  {tags.map((tag, index) => (
                    <a key={index} href="#!" className="btn btn-light m-1">{tag}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Blog End */}

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

export default Single; 