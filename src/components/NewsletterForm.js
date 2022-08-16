import React from "react";
import { Link } from "react-router-dom";

//import "./../assets/css/components/headingblock.css";

const NewsletterForm = (props) => {
	let { heading, className } = props;

  	const handleSubmit = (event) => {
    	alert('Submit');
    	event.preventDefault();
  	}

	return (
  		<form className="newsletter-form__container" onSubmit={handleSubmit}>
	        <label>
	          <input name="firstName" className="" type="text" placeholder="meno" />
	        </label>
	        <label>
	          <input name="lastName" className="" type="text" placeholder="priezvisko"  />
	        </label>	        
	        <label>
	          <input name="email" className="" type="text" placeholder="email"  />
	        </label>	        
	        <label>
	          <input name="mobilePhone" className="" type="text"  placeholder="tel. číslo" />
	        </label>

	        <input type="submit" value="poslať" />

			<span className="newsletter-form__disclaimer">
				* <Link to="/gdpr">Ochrana osobných údajov</Link>
			</span>

      	</form>
	)
}

export default NewsletterForm;