<template>
  <!-- Header Start -->
  <div class="container-fluid page-header">
    <div class="container">
      <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 400px">
        <h3 class="display-4 text-white text-uppercase">Contact</h3>
        <div class="d-inline-flex text-white">
          <router-link class="text-white" to="/">Home</router-link>
          <i class="fa fa-angle-double-right pt-1 px-3"></i>
          <span class="m-0 text-uppercase">Contact</span>
        </div>
      </div>
    </div>
  </div>
  <!-- Header End -->

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

  <!-- Contact Start -->
  <div class="container-fluid py-5">
    <div class="container py-5">
      <div class="text-center mb-3 pb-3">
        <h6 class="text-primary text-uppercase" style="letter-spacing: 5px;">Contact</h6>
        <h1>Contact For Any Query</h1>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="contact-form bg-white" style="padding: 30px;">
            <form name="sentMessage" id="contactForm" novalidate="novalidate">
              <div class="form-row">
                <div class="control-group col-sm-6">
                  <input type="text" class="form-control p-4" id="name" placeholder="Your Name" required="required" />
                  <p class="help-block text-danger"></p>
                </div>
                <div class="control-group col-sm-6">
                  <input type="email" class="form-control p-4" id="email" placeholder="Your Email" required="required" />
                  <p class="help-block text-danger"></p>
                </div>
              </div>
              <div class="control-group">
                <input type="text" class="form-control p-4" id="subject" placeholder="Subject" required="required" />
                <p class="help-block text-danger"></p>
              </div>
              <div class="control-group">
                <textarea class="form-control py-3 px-4" rows="5" id="message" placeholder="Message" required="required"></textarea>
                <p class="help-block text-danger"></p>
              </div>
              <div class="text-center">
                <button class="btn btn-primary py-3 px-4" type="submit" id="sendMessageButton">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Contact End -->

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
  name: 'ContactPage'
}
</script>

<style scoped>
</style> 