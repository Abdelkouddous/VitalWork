import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/ContactPage.js";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <Wrapper>
      {/* Decorative background blobs */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>

      <div className="contact-container">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Get In Touch Card */}
          <div className="lg:col-span-5 info-column">
            <div className="info-grid-overlay"></div>
            
            <div className="relative z-10">
              <h1 className="info-title">Get in touch</h1>
              <p className="info-desc">
                Have questions about VitalWork Connect? We're here to help you find your dream job or the perfect candidate.
              </p>

              <div className="info-items">
                {/* Phone Item */}
                <div className="info-item">
                  <div className="icon-wrapper">
                    <FaPhone className="text-white text-lg" />
                  </div>
                  <div className="info-detail">
                    <p className="item-label">Phone</p>
                    <p className="item-value clickable">+213 549 882 456</p>
                  </div>
                </div>

                {/* Email Item */}
                <div className="info-item">
                  <div className="icon-wrapper">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div className="info-detail">
                    <p className="item-label">Email</p>
                    <p className="item-value clickable">hml_soft@VitalWork.com</p>
                  </div>
                </div>

                {/* Location Item */}
                <div className="info-item">
                  <div className="icon-wrapper">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <div className="info-detail">
                    <p className="item-label">Location</p>
                    <p className="item-value">Dar El Beida, Algiers, Algeria</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-text">
              © {new Date().getFullYear()} VitalWork. All rights reserved.
            </div>
          </div>

          {/* Right Column: Send Us A Message Form */}
          <div className="lg:col-span-7 form-column">
            <h2 className="form-title">Send us a message</h2>
            <p className="form-desc">
              Drop us a line and our dedicated team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message Input */}
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <FaPaperPlane className="text-sm" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </Wrapper>
  );
};

export default Contact;
