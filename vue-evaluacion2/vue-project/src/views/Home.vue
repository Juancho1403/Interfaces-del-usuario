<template>
  <!-- Topbar Start -->
  <div v-if="!isPreview" class="container-fluid bg-light pt-3 d-none d-lg-block">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 text-center text-lg-left mb-2 mb-lg-0">
          <div class="d-inline-flex align-items-center">
            <p><i class="fa fa-envelope mr-2"></i>info@example.com</p>
            <p class="text-body px-3">|</p>
            <p><i class="fa fa-phone-alt mr-2"></i>+012 345 6789</p>
          </div>
        </div>
        <div class="col-lg-6 text-center text-lg-right">
          <div class="d-inline-flex align-items-center">
            <a class="text-primary px-3" href=""><i class="fab fa-facebook-f"></i></a>
            <a class="text-primary px-3" href=""><i class="fab fa-twitter"></i></a>
            <a class="text-primary px-3" href=""><i class="fab fa-linkedin-in"></i></a>
            <a class="text-primary px-3" href=""><i class="fab fa-instagram"></i></a>
            <a class="text-primary pl-3" href=""><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Topbar End -->

  <!-- Navbar Start -->
  <div v-if="!isPreview" class="container-fluid position-relative nav-bar p-0">
    <div class="container-lg position-relative p-0 px-lg-3" style="z-index: 9;">
      <nav class="navbar navbar-expand-lg bg-light navbar-light shadow-lg py-3 py-lg-0 pl-3 pl-lg-5">
        <router-link to="/" class="navbar-brand">
          <h1 class="m-0 text-primary"><span class="text-dark">TRAVEL</span>ER</h1>
        </router-link>
        <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-between px-3" id="navbarCollapse">
          <div class="navbar-nav ml-auto py-0">
            <router-link to="/" class="nav-item nav-link active">Home</router-link>
            <router-link to="/configuraciones" class="nav-item nav-link">Configuraciones</router-link>
            <router-link to="/usuarios" class="nav-item nav-link">usuarios</router-link>
            <router-link to="/about" class="nav-item nav-link">About</router-link>
            <router-link to="/service" class="nav-item nav-link">Services</router-link>
            <router-link to="/package" class="nav-item nav-link">Tour Packages</router-link>
            <div class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Pages</a>
              <div class="dropdown-menu border-0 rounded-0 m-0">
                <router-link to="/blog" class="dropdown-item">Blog Grid</router-link>
                <router-link to="/single" class="dropdown-item">Blog Detail</router-link>
                <router-link to="/destination" class="dropdown-item">Destination</router-link>
                <router-link to="/guide" class="dropdown-item">Travel Guides</router-link>
                <router-link to="/testimonial" class="dropdown-item">Testimonial</router-link>
              </div>
            </div>
            <router-link to="/contact" class="nav-item nav-link">Contact</router-link>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <!-- Navbar End -->

  <!-- Carousel Start -->
  <div class="container-fluid p-0">
    <div id="header-carousel" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img class="w-100" :src="require('@/assets/carousel-1.jpg')" alt="Image">
          <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div class="p-3" style="max-width: 900px;">
              <h4 class="text-white text-uppercase mb-md-3">Tours & Travel</h4>
              <h1 class="display-3 text-white mb-md-4">Let's Discover The World Together</h1>
              <a href="#" class="btn btn-primary py-md-3 px-md-5 mt-2">Book Now</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <img class="w-100" :src="require('@/assets/carousel-2.jpg')" alt="Image">
          <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div class="p-3" style="max-width: 900px;">
              <h4 class="text-white text-uppercase mb-md-3">Tours & Travel</h4>
              <h1 class="display-3 text-white mb-md-4">Discover Amazing Places With Us</h1>
              <a href="#" class="btn btn-primary py-md-3 px-md-5 mt-2">Book Now</a>
            </div>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#header-carousel" data-slide="prev">
        <div class="btn btn-dark" style="width: 45px; height: 45px;">
          <span class="carousel-control-prev-icon mb-n2"></span>
        </div>
      </a>
      <a class="carousel-control-next" href="#header-carousel" data-slide="next">
        <div class="btn btn-dark" style="width: 45px; height: 45px;">
          <span class="carousel-control-next-icon mb-n2"></span>
        </div>
      </a>
    </div>
  </div>
  <!-- Carousel End -->

  <!-- Booking Start -->
  <div class="container-fluid booking mt-5 pb-5">
    <div class="container pb-5">
      <div class="bg-light shadow" style="padding: 30px;">
        <div class="row align-items-center" style="min-height: 60px;">
          <div class="col-md-10">
            <div class="row">
              <div class="col-md-3">
                <div class="mb-3 mb-md-0">
                  <select class="custom-select px-4" style="height: 47px;">
                    <option selected>Destination</option>
                    <option value="1">Destination 1</option>
                    <option value="2">Destination 1</option>
                    <option value="3">Destination 1</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3 mb-md-0">
                  <div class="date" id="date1" data-target-input="nearest">
                    <input type="text" class="form-control p-4 datetimepicker-input" placeholder="Depart Date" data-target="#date1" data-toggle="datetimepicker"/>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3 mb-md-0">
                  <div class="date" id="date2" data-target-input="nearest">
                    <input type="text" class="form-control p-4 datetimepicker-input" placeholder="Return Date" data-target="#date2" data-toggle="datetimepicker"/>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3 mb-md-0">
                  <select class="custom-select px-4" style="height: 47px;">
                    <option selected>Duration</option>
                    <option value="1">Duration 1</option>
                    <option value="2">Duration 1</option>
                    <option value="3">Duration 1</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary btn-block" type="submit" style="height: 47px; margin-top: -2px;">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Booking End -->

  <!-- About Start -->
  <div class="container-fluid py-5">
    <div class="container pt-5">
      <div class="row">
        <div class="col-lg-6" style="min-height: 500px;">
          <div class="position-relative h-100">
            <img class="position-absolute w-100 h-100" :src="require('@/assets/about.jpg')" style="object-fit: cover;">
          </div>
        </div>
        <div class="col-lg-6 pt-5 pb-lg-5">
          <div class="about-text bg-white p-4 p-lg-5 my-lg-5">
            <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">About Us</h6>
            <h1 class="mb-3">We Provide Best Tour Packages In Your Budget</h1>
            <p>Dolores lorem lorem ipsum sit et ipsum. Sadip sea amet diam dolore sed et. Sit rebum labore sit sit ut vero no sit. Et elitr stet dolor sed sit et sed ipsum et kasd ut. Erat duo eos et erat sed diam duo</p>
            <div class="row mb-4">
              <div class="col-6">
                <img class="img-fluid" :src="require('@/assets/about-1.jpg')" alt="">
              </div>
              <div class="col-6">
                <img class="img-fluid" :src="require('@/assets/about-2.jpg')" alt="">
              </div>
            </div>
            <a href="#" class="btn btn-primary mt-1">Book Now</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- About End -->

  <!-- Feature Start -->
  <div class="container-fluid pb-5">
    <div class="container pb-5">
      <div class="row">
        <div class="col-md-4">
          <div class="d-flex mb-4 mb-lg-0">
            <div class="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary mr-3" style="height: 100px; width: 100px;">
              <i class="fa fa-2x fa-money-check-alt text-white"></i>
            </div>
            <div class="d-flex flex-column">
              <h5 class="">Competitive Pricing</h5>
              <p class="m-0">Magna sit magna dolor duo dolor labore rebum amet elitr est diam sea</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="d-flex mb-4 mb-lg-0">
            <div class="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary mr-3" style="height: 100px; width: 100px;">
              <i class="fa fa-2x fa-award text-white"></i>
            </div>
            <div class="d-flex flex-column">
              <h5 class="">Best Services</h5>
              <p class="m-0">Magna sit magna dolor duo dolor labore rebum amet elitr est diam sea</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="d-flex mb-4 mb-lg-0">
            <div class="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary mr-3" style="height: 100px; width: 100px;">
              <i class="fa fa-2x fa-globe text-white"></i>
            </div>
            <div class="d-flex flex-column">
              <h5 class="">Worldwide Coverage</h5>
              <p class="m-0">Magna sit magna dolor duo dolor labore rebum amet elitr est diam sea</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Feature End -->

  <!-- Destination Start -->
  <div class="container-fluid py-5">
    <div class="container pt-5 pb-3">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Destination</h6>
        <h1>Explore Top Destination</h1>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="(dest, i) in destinations" :key="i">
          <div class="destination-item position-relative overflow-hidden mb-2">
            <img class="img-fluid" :src="require(`@/assets/destination-${i+1}.jpg`)" alt="">
            <a class="destination-overlay text-white text-decoration-none" href="#">
              <h5 class="text-white">{{ dest.name }}</h5>
              <span>{{ dest.cities }} Cities</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Destination End -->

  <!-- Service Start -->
  <div class="container-fluid py-5">
    <div class="container pt-5 pb-3">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Services</h6>
        <h1>Tours & Travel Services</h1>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="(service, i) in services" :key="i">
          <div class="service-item bg-white text-center mb-2 py-5 px-4">
            <i :class="service.icon + ' fa-2x mx-auto mb-4'"></i>
            <h5 class="mb-2">{{ service.title }}</h5>
            <p class="m-0">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Service End -->

  <!-- Packages Start -->
  <div class="container-fluid py-5">
    <div class="container pt-5 pb-3">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Packages</h6>
        <h1>Pefect Tour Packages</h1>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="(pkg, i) in packages" :key="i">
          <div class="package-item bg-white mb-2">
            <img class="img-fluid" :src="require(`@/assets/package-${i+1}.jpg`)" alt="">
            <div class="p-4">
              <div class="d-flex justify-content-between mb-3">
                <small class="m-0"><i class="fa fa-map-marker-alt text-primary mr-2"></i>{{ pkg.country }}</small>
                <small class="m-0"><i class="fa fa-calendar-alt text-primary mr-2"></i>{{ pkg.days }} days</small>
                <small class="m-0"><i class="fa fa-user text-primary mr-2"></i>{{ pkg.people }} Person</small>
              </div>
              <a class="h5 text-decoration-none" href="#">{{ pkg.title }}</a>
              <div class="border-top mt-4 pt-4">
                <div class="d-flex justify-content-between">
                  <h6 class="m-0"><i class="fa fa-star text-primary mr-2"></i>{{ pkg.rating }} <small>({{ pkg.reviews }})</small></h6>
                  <h5 class="m-0">${{ pkg.price }}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Packages End -->

  <!-- Registration Start -->
  <div class="container-fluid bg-registration py-5" style="margin: 90px 0;">
    <div class="container py-5">
      <div class="row align-items-center">
        <div class="col-lg-7 mb-5 mb-lg-0">
          <div class="mb-4">
            <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Mega Offer</h6>
            <h1 class="text-white"><span class="text-primary">30% OFF</span> For Honeymoon</h1>
          </div>
          <p class="text-white">Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo dolor lorem ipsum ut sed eos,
            ipsum et dolor kasd sit ea justo. Erat justo sed sed diam. Ea et erat ut sed diam sea ipsum est
            dolor</p>
          <ul class="list-inline text-white m-0">
            <li class="py-2"><i class="fa fa-check text-primary mr-3"></i>Labore eos amet dolor amet diam</li>
            <li class="py-2"><i class="fa fa-check text-primary mr-3"></i>Etsea et sit dolor amet ipsum</li>
            <li class="py-2"><i class="fa fa-check text-primary mr-3"></i>Diam dolor diam elitripsum vero.</li>
          </ul>
        </div>
        <div class="col-lg-5">
          <div class="card border-0">
            <div class="card-header bg-primary text-center p-4">
              <h1 class="text-white m-0">Sign Up Now</h1>
            </div>
            <div class="card-body rounded-bottom bg-white p-5">
              <form>
                <div class="form-group">
                  <input type="text" class="form-control p-4" placeholder="Your name" required="required" />
                </div>
                <div class="form-group">
                  <input type="email" class="form-control p-4" placeholder="Your email" required="required" />
                </div>
                <div class="form-group">
                  <select class="custom-select px-4" style="height: 47px;">
                    <option selected>Select a destination</option>
                    <option value="1">destination 1</option>
                    <option value="2">destination 1</option>
                    <option value="3">destination 1</option>
                  </select>
                </div>
                <div>
                  <button class="btn btn-primary btn-block py-3" type="submit">Sign Up Now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Registration End -->

  <!-- Team Start -->
  <div class="container-fluid py-5">
    <div class="container pt-5 pb-3">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Guides</h6>
        <h1>Our Travel Guides</h1>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-6 pb-2" v-for="(guide, i) in guides" :key="i">
          <div class="team-item bg-white mb-4">
            <div class="team-img position-relative overflow-hidden">
              <img class="img-fluid w-100" :src="require(`@/assets/team-${i+1}.jpg`)" alt="">
              <div class="team-social">
                <a class="btn btn-outline-primary btn-square" href="#"><i class="fab fa-twitter"></i></a>
                <a class="btn btn-outline-primary btn-square" href="#"><i class="fab fa-facebook-f"></i></a>
                <a class="btn btn-outline-primary btn-square" href="#"><i class="fab fa-instagram"></i></a>
                <a class="btn btn-outline-primary btn-square" href="#"><i class="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div class="text-center py-4">
              <h5 class="text-truncate">Guide Name</h5>
              <p class="m-0">Designation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Team End -->

  <!-- Testimonial Start -->
  <div class="container-fluid py-5">
    <div class="container py-5">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Testimonial</h6>
        <h1>What Say Our Clients</h1>
      </div>
      <div class="d-flex flex-column align-items-center">
        <div class="text-center pb-4">
          <img class="img-fluid mx-auto" :src="require(`@/assets/testimonial-${testimonialIndex+1}.jpg`)" style="width: 100px; height: 100px;">
          <div class="testimonial-text bg-white p-4 mt-n5">
            <p class="mt-5">{{ testimonials[testimonialIndex].text }}</p>
            <h5 class="text-truncate">Client Name</h5>
            <span>Profession</span>
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-outline-primary mx-1" @click="prevTestimonial">&lt;</button>
          <button class="btn btn-outline-primary mx-1" @click="nextTestimonial">&gt;</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Testimonial End -->

  <!-- Blog Start -->
  <div class="container-fluid py-5">
    <div class="container pt-5 pb-3">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Our Blog</h6>
        <h1>Latest From Our Blog</h1>
      </div>
      <div class="row pb-3">
        <div class="col-lg-4 col-md-6 mb-4 pb-2" v-for="(blog, i) in blogs" :key="i">
          <div class="blog-item">
            <div class="position-relative">
              <img class="img-fluid w-100" :src="require(`@/assets/blog-${i+1}.jpg`)" alt="">
              <div class="blog-date">
                <h6 class="font-weight-bold mb-n1">01</h6>
                <small class="text-white text-uppercase">Jan</small>
              </div>
            </div>
            <div class="bg-white p-4">
              <div class="d-flex mb-2">
                <a class="text-primary text-uppercase text-decoration-none" href="#">Admin</a>
                <span class="text-primary px-2">|</span>
                <a class="text-primary text-uppercase text-decoration-none" href="#">Tours & Travel</a>
              </div>
              <a class="h5 m-0 text-decoration-none" href="#">Dolor justo sea kasd lorem clita justo diam amet</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Blog End -->

  <!-- Footer Start -->
  <div class="container-fluid bg-dark text-white-50 py-5 px-sm-3 px-lg-5" style="margin-top: 90px;">
    <div class="row pt-5">
      <div class="col-lg-3 col-md-6 mb-5">
        <a href="#" class="navbar-brand">
          <h1 class="text-primary"><span class="text-white">TRAVEL</span>ER</h1>
        </a>
        <p>Sed ipsum clita tempor ipsum ipsum amet sit ipsum lorem amet labore rebum lorem ipsum dolor. No sed vero lorem dolor dolor</p>
        <h6 class="text-white text-uppercase mt-4 mb-3" style="letter-spacing: 5px;">Follow Us</h6>
        <div class="d-flex justify-content-start">
          <a class="btn btn-outline-primary btn-square mr-2" href="#"><i class="fab fa-twitter"></i></a>
          <a class="btn btn-outline-primary btn-square mr-2" href="#"><i class="fab fa-facebook-f"></i></a>
          <a class="btn btn-outline-primary btn-square mr-2" href="#"><i class="fab fa-linkedin-in"></i></a>
          <a class="btn btn-outline-primary btn-square" href="#"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 mb-5">
        <h5 class="text-white text-uppercase mb-4" style="letter-spacing: 5px;">Our Services</h5>
        <div class="d-flex flex-column justify-content-start">
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>About</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Destination</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Services</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Packages</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Guides</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Testimonial</a>
          <a class="text-white-50" href="#"><i class="fa fa-angle-right mr-2"></i>Blog</a>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 mb-5">
        <h5 class="text-white text-uppercase mb-4" style="letter-spacing: 5px;">Usefull Links</h5>
        <div class="d-flex flex-column justify-content-start">
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>About</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Destination</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Services</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Packages</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Guides</a>
          <a class="text-white-50 mb-2" href="#"><i class="fa fa-angle-right mr-2"></i>Testimonial</a>
          <a class="text-white-50" href="#"><i class="fa fa-angle-right mr-2"></i>Blog</a>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 mb-5">
        <h5 class="text-white text-uppercase mb-4" style="letter-spacing: 5px;">Contact Us</h5>
        <p><i class="fa fa-map-marker-alt mr-2"></i>123 Street, New York, USA</p>
        <p><i class="fa fa-phone-alt mr-2"></i>+012 345 67890</p>
        <p><i class="fa fa-envelope mr-2"></i>info@example.com</p>
        <h6 class="text-white text-uppercase mt-4 mb-3" style="letter-spacing: 5px;">Newsletter</h6>
        <div class="w-100">
          <div class="input-group">
            <input type="text" class="form-control border-light" style="padding: 25px;" placeholder="Your Email">
            <div class="input-group-append">
              <button class="btn btn-primary px-3">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid bg-dark text-white border-top py-4 px-sm-3 px-md-5" style="border-color: rgba(256, 256, 256, .1) !important;">
    <div class="row">
      <div class="col-lg-6 text-center text-md-left mb-3 mb-md-0">
        <p class="m-0 text-white-50">Copyright &copy; <a href="#">Domain</a>. All Rights Reserved.</p>
      </div>
      <div class="col-lg-6 text-center text-md-right">
        <p class="m-0 text-white-50">Designed by <a href="https://htmlcodex.com">HTML Codex</a>
        </p>
      </div>
    </div>
  </div>
  <!-- Footer End -->
</template>

<script>
export default {
  name: 'HomeView',
  props: {
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      destinations: [
        { name: 'United States', cities: 100 },
        { name: 'United Kingdom', cities: 100 },
        { name: 'Australia', cities: 100 },
        { name: 'India', cities: 100 },
        { name: 'South Africa', cities: 100 },
        { name: 'Indonesia', cities: 100 }
      ],
      services: [
        { icon: 'fa fa-route', title: 'Travel Guide', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
        { icon: 'fa fa-ticket-alt', title: 'Ticket Booking', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' },
        { icon: 'fa fa-hotel', title: 'Hotel Booking', desc: 'Justo sit justo eos amet tempor amet clita amet ipsum eos elitr. Amet lorem est amet labore' }
      ],
      packages: [
        { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
        { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
        { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
        { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
        { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 },
        { country: 'Thailand', days: 3, people: 2, title: 'Discover amazing places of the world with us', rating: 4.5, reviews: 250, price: 350 }
      ],
      guides: [1, 2, 3, 4],
      testimonialIndex: 0,
      testimonialInterval: null,
      testimonials: [
        { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
        { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
        { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' },
        { text: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam' }
      ],
      blogs: [1, 2, 3]
    }
  },
  mounted() {
    this.startTestimonialAutoSlide();
  },
  beforeUnmount() {
    clearInterval(this.testimonialInterval);
  },
  methods: {
    nextTestimonial() {
      this.testimonialIndex = (this.testimonialIndex + 1) % this.testimonials.length;
    },
    prevTestimonial() {
      this.testimonialIndex = (this.testimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
    },
    startTestimonialAutoSlide() {
      this.testimonialInterval = setInterval(() => {
        this.nextTestimonial();
      }, 5000);
    }
  }
}
</script>

<style scoped>
/* Puedes importar los estilos globales en main.js o App.vue */
</style> 