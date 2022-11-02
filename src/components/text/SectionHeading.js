import React from "react";

//import "./../assets/css/components/headingblock.css";

const SectionHeading = (props) => {
	let { heading, className, children } = props;
	return (
		<h1 className={`section-heading ${className}`}>{heading}{children}</h1>
	)
}

export default SectionHeading;