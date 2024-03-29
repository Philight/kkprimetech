import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Icon, Image } from '@components/graphic';
import { FullheightHeading } from '@components/text';
import { createArrayGroups, useDeviceDimensions } from '@utils';

const getGridDimensions = (DEVICE_TYPE) => {
  switch (DEVICE_TYPE) {
  case 'DESKTOP_XL':
  case 'DESKTOP_LG':
  case 'DESKTOP_MD':
  case 'DESKTOP_SM':
    return { rows: 1, cols: 3 };
  case 'TABLET_LG':
  case 'TABLET_MD':
  case 'TABLET_SM':
    return { rows: 1, cols: 2 };
  case 'MOBILE_LG':
  case 'MOBILE_SM':
    return { rows: 1, cols: 1 };
  default:
    return { rows: 1, cols: 1 };
  }
};

const GalleryCarousel = (props) => {
  let {
    className,
    gallery,
    columns,
    rows,
    enableAutoplay,
    interval,
    enableArrows,
    enableNavigation
  } = props;

  const { DEVICE_TYPE } = useDeviceDimensions();
  const [ activeIndex, setActiveIndex ] = useState(0);
  const timeoutRef = useRef(null);

  const COLUMNS = columns ?? getGridDimensions(DEVICE_TYPE).cols;
  const ROWS = rows ?? getGridDimensions(DEVICE_TYPE).rows;
  const galleryLength = Object.keys(gallery).length;

  let arraySize = Math.ceil(galleryLength / COLUMNS);
  const navDotIndexes = [ ...Array(arraySize).keys() ];

  const updateIndex = (newIndex) => () => {
    let updatedIndex = newIndex;
    if (newIndex > (galleryLength / COLUMNS) * ROWS - 1) {
      updatedIndex = 0;
    }
    setActiveIndex(updatedIndex);
  };

  const resetTimeout = () => {
    if (enableAutoplay && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    console.log('autoplay');
    if (enableAutoplay) {
      //      console.log(`gallery.length ${galleryLength}`);
      //      console.log(COLUMNS);
      timeoutRef.current = setTimeout(
        () =>
          setActiveIndex((prevIndex) =>
            prevIndex + 1 >= galleryLength / COLUMNS ? 0 : prevIndex + 1
          ),
        interval
      );

      return () => {
        resetTimeout();
      };
    }
  }, [ activeIndex ]);

  return (
    <div className={`gallery-carousel__c f-grid cols-${COLUMNS} rows-${ROWS} ${className}`}>
      {enableArrows && (
        <Icon
          icon='chevron-left'
          className={`nav-arrow left highlight primary`}
          onClick={updateIndex(activeIndex - 1)}
        />
      )}
      <div className='gallery-carousel__houses-container carousel-view'>
        <div
          className='carousel-slider'
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {createArrayGroups(COLUMNS * ROWS, gallery).map((gridGroup, groupIndex) => (
            <div key={`f-grid-group-${groupIndex}`} className='f-grid-group'>
              {createArrayGroups(COLUMNS, gridGroup).map((gridRow, rowIndex) => (
                <div key={`f-grid-row-${rowIndex}`} className='f-grid-row'>
                  {gridRow.map((item, index) => (
                    <div
                      key={`gallery-carousel__house-${index}`}
                      className='gallery-carousel__item f-grid-item'
                      id={`gallery-carousel__house-${index}`}
                    >
                      {item.link && <Link to={item.link} className='fill-absolute' />}
                      <Image className='gallery-carousel__image-wrapper' src={item.src} />
                      <FullheightHeading heading1={item.title} heading2={`0${index + 1}`} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {enableNavigation && (
        <div className='gallery-carousel__navigation'>
          {navDotIndexes.map((item, itemIndex) => (
            <div
              key={`item-${itemIndex}`}
              className={`gallery-carousel__navigation-dot ${
                activeIndex >= itemIndex ? 'active' : ''
              }`}
              onClick={updateIndex(itemIndex)}
            />
          ))}
        </div>
      )}
      {enableArrows && (
        <Icon
          icon='chevron-right'
          className={`nav-arrow right highlight primary`}
          onClick={updateIndex(activeIndex + 1)}
        />
      )}
    </div>
  );
};

export default GalleryCarousel;
