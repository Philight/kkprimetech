import { useState, forwardRef } from 'react';

import DesignAndArchitectureTiles from '@components/DesignAndArchitectureTiles';
import { FullwidthHeading } from '@components/text';
import { Icon } from '@components/graphic';
import { createArrayGroups, useDeviceDimensions } from '@utils';

const getGridDimensions = (DEVICE_TYPE) => {
  switch (DEVICE_TYPE) {
  case 'MOBILE_SM':
  case 'MOBILE_LG':
  case 'TABLET_SM':
  case 'TABLET_MD':
  case 'TABLET_LG':
    return { rows: 4, cols: 1 };
  case 'DESKTOP_SM':
  case 'DESKTOP_MD':
  case 'DESKTOP_LG':
  case 'DESKTOP_XL':
    return { rows: 2, cols: 2 };
  default:
    return { rows: 4, cols: 1 };
  }
};

const DesignAndArchitecture = forwardRef((props, ref) => {
  let { data, columns, rows } = props;

  const { DEVICE_TYPE } = useDeviceDimensions();
  const [ activeIndex, setActiveIndex ] = useState(0);

  const COLUMNS = columns ?? getGridDimensions(DEVICE_TYPE).cols;
  const ROWS = rows ?? getGridDimensions(DEVICE_TYPE).rows;

  const updateIndex = (newIndex) => () => {
    let updatedIndex = newIndex;
    if (newIndex >= data.length / (COLUMNS * ROWS)) {
      updatedIndex = 0;
    }
    setActiveIndex(updatedIndex);
  };

  return (
    <div
      className={`design-and-architecture__c f-col f-grid cols-${COLUMNS} rows-${ROWS}`}
      ref={ref}
    >
      <FullwidthHeading heading1={`dizajn`} heading2={`a architektúra`} />

      <div className='carousel-view'>
        <div
          className='carousel-slider'
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {createArrayGroups(COLUMNS * ROWS, data).map((gridGroup, groupIndex) => (
            <div
              key={`f-grid-group-${groupIndex}`}
              className='design-and-architecture__tiles-group carousel-group f-grid-group'
            >
              {createArrayGroups(COLUMNS, gridGroup).map((gridRow, rowIndex) => (
                <div key={`f-grid-row-${rowIndex}`} className='f-grid-row'>
                  {gridRow.map((tile, itemIndex) => (
                    <div key={`f-grid-item-${itemIndex}`} className={`f-grid-item`}>
                      <DesignAndArchitectureTiles tile={tile} index={itemIndex} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Icon
        icon='chevron-right'
        className='nav-arrow highlight flying right primary'
        onClick={updateIndex(activeIndex + 1)}
      />
    </div>
  );
});

export default DesignAndArchitecture;
