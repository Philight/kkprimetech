import { useState, useEffect, useRef } from 'react';

import { FullwidthHeading } from '@components/text';
import { Icon, Image } from '@components/graphic';
import { DEFAULT_SIZES_BREAKPOINTS, CONSTANTS } from '@data';
import { createArrayGroups, useDeviceDimensions } from '@utils';

const INSTAGRAM_URL = CONSTANTS.INSTAGRAM_URL;

const getGridDimensions = (DEVICE_TYPE) => {
  switch (DEVICE_TYPE) {
  case 'DESKTOP_XL':
  case 'DESKTOP_LG':
  case 'DESKTOP_MD':
    return { rows: 2, cols: 4 };
  case 'DESKTOP_SM':
  case 'TABLET_LG':
    return { rows: 2, cols: 3 };
  case 'TABLET_MD':
  case 'TABLET_SM':
    return { rows: 2, cols: 2 };
  case 'MOBILE_LG':
  case 'MOBILE_SM':
    return { rows: 2, cols: 1 };
  default:
    return { rows: 1, cols: 1 };
  }
};

const sizesBreakpoints = Object.keys(DEFAULT_SIZES_BREAKPOINTS).reduce(
  (acc, bp) => ({
    ...acc,
    [bp]: `calc(100vw / ${getGridDimensions(bp).cols})`
  }),
  {}
);

const SocialGrid = (props) => {
  let { columns, rows, posts, enableAutoplay, interval } = props;

  const { DEVICE_TYPE } = useDeviceDimensions();
  const [ activeIndex, setActiveIndex ] = useState(0);
  const [ contentShown, setContentShown ] = useState(false);

  const timeoutRef = useRef(null);

  const COLUMNS = columns ?? getGridDimensions(DEVICE_TYPE).cols;
  const ROWS = rows ?? getGridDimensions(DEVICE_TYPE).rows;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (enableAutoplay) {
      resetTimeout();

      timeoutRef.current = setTimeout(() => setContentShown((prevValue) => !prevValue), interval);
    }

    return () => {
      resetTimeout();
    };
  }, [ contentShown ]);

  const updateIndex = (newIndex) => () => {
    let updatedIndex = newIndex;
    if (updatedIndex > Math.ceil(Object.keys(posts).length / COLUMNS / ROWS - 1)) {
      updatedIndex = 0;
    }
    setActiveIndex(updatedIndex);
  };

  return (
    <section className={`social-grid__c f-grid cols-${COLUMNS} rows-${ROWS}`}>
      <FullwidthHeading heading1='primetech' heading2='social' />

      <div className={`carousel-view social-grid__posts`}>
        <Icon
          icon='chevron-right'
          className='nav-arrow highlight flying right primary'
          onClick={updateIndex(activeIndex + 1)}
        />
        <div className={`carousel-slider social-grid__posts-container `}>
          {createArrayGroups(ROWS * COLUMNS, posts).map((gridGroup, groupIndex) => (
            <div
              key={`f-grid-group-${groupIndex}`}
              className='f-grid-group carousel-group social-grid__posts-group'
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {createArrayGroups(COLUMNS, gridGroup).map((gridRow, rowIndex) => (
                <div key={`f-grid-row-${rowIndex}`} className='f-grid-row'>
                  {gridRow.map((post, postIndex) => (
                    <div key={`f-grid-item-${postIndex}`} className='f-grid-item social-grid__post'>
                      <Image src={post.imageSrc} sizesBreakpoints={sizesBreakpoints} withSizes />
                      <a href={INSTAGRAM_URL} target='_blank' rel='noreferrer'>
                        <div
                          className={`social-grid__post-content f-col f-center absolute-fill ${
                            postIndex % 2 && contentShown ? 'shown' : ''
                          }`}
                        >
                          <Icon icon='instagram' className={`social-grid__post-icon`} />
                          <p>{post.text}</p>
                          <p>{post.hashtags}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialGrid;
