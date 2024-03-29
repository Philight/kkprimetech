import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

import { arrReplaceNewline } from '@utils';
import { Icon } from '@components/graphic';
import { ENV } from '@data';

const GOOGLE_API_KEY = ENV.GOOGLE_API_KEY;

const LocationPin = ({ text }) => {
  return (
    <div className='google-map__location f-center'>
      <Icon icon='location' />
      <span>{text}</span>
    </div>
  );
};

const GoogleMap = (props) => {
  let { className, location, zoom } = props;

  const [ textArray, setTextArray ] = useState([]);

  useEffect(() => {
    setTextArray(arrReplaceNewline(location.address));
  }, [ location ]);

  return (
    <section className={`google-map__c f-col ${className}`}>
      <div className='google-map__map-wrapper'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
          defaultCenter={location}
          defaultZoom={zoom}
        >
          <LocationPin lat={location.lat} lng={location.lng} text={textArray[0]} />
        </GoogleMapReact>
      </div>
      <div className='google-map__address'>
        {textArray.map((text, index) => (
          <React.Fragment key={index}>
            {index === 0 ? <h3>{text}</h3> : <p>{text}</p>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default GoogleMap;
