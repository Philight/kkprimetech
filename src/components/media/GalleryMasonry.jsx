import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Image from "@components/graphic/Image";
import Layer from "@components/graphic/Layer";
import Icon from "@components/graphic/Icon";
import useDeviceDimensions, { createArrayGroups } from "@utils";

//import "@css/components/gallerymasonry.css";

const getGridDimensions = (DEVICE_TYPE) => {
  switch (DEVICE_TYPE) {
    case 'MOBILE_SM':
    case 'MOBILE_LG':
    case 'TABLET_SM':
      return { rows: 0, cols: 2 };
    case 'TABLET_MD':
    case 'TABLET_LG':
    case 'DESKTOP_SM':
      return { rows: 0, cols: 3 };
    case 'DESKTOP_MD':
    case 'DESKTOP_LG':
    case 'DESKTOP_XL':
      return { rows: 0, cols: 4 };
    default:
      return { rows: 0, cols: 2 };
  }
};

const getItemsLimit = (DEVICE_TYPE) => {
  switch (DEVICE_TYPE) {
    case 'MOBILE_SM':
    case 'MOBILE_LG':
    case 'TABLET_SM':
    case 'TABLET_MD':
    case 'TABLET_LG':
    case 'DESKTOP_SM':
      return 12;
    case 'DESKTOP_MD':
    case 'DESKTOP_LG':
    case 'DESKTOP_XL':
      return 24;
    default:
      return 12;
  }
};

const GalleryMasonry = (props) => {
	let { gallery, columns, rows, showLimit, loadBtnText } = props;

  	const { DEVICE_TYPE } = useDeviceDimensions();

	const [modalVisible, setModalVisible] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [timesLoaded, setTimesLoaded] = useState(1);
	const [gridMaxHeight, setGridMaxHeight] = useState('px');
	const [gridVPadding, setGridVPadding] = useState(0);

 	const gridRef = useRef(null);

	const COLUMNS = columns ?? getGridDimensions(DEVICE_TYPE).cols;
	const ROWS = rows ?? getGridDimensions(DEVICE_TYPE).rows;
	const ITEMS_COUNT = showLimit ?? getItemsLimit(DEVICE_TYPE); 

	useLayoutEffect(() => {
		let nodeStyle = window.getComputedStyle(gridRef.current);
		let VPadding = parseInt(nodeStyle.paddingTop.replace('px', '')) + parseInt(nodeStyle.paddingBottom.replace('px', ''));
		setGridVPadding(VPadding);

		setGridMaxHeight(nodeStyle.getPropertyValue('height'));
	}, [])

	// Create Custom Event for Navigation bar
	const hideNavEvent = new CustomEvent('hidenavigation', { detail: true });
	const showNavEvent = new CustomEvent('hidenavigation', { detail: false });

	const showModal = (index) => () => {
		setActiveIndex(index);
		setTimeout(() => {
			setModalVisible(true);
		}, 50)

		window.dispatchEvent(hideNavEvent);
	}
	const hideModal = () => () => {
		setModalVisible(false);

		window.dispatchEvent(showNavEvent);
	}

	const updateIndex = (newIndex) => () => {
		if (newIndex > (gallery.length)-1) {
			newIndex = Math.ceil((gallery.length)-1);
		
		} else if (newIndex < 0) {
			newIndex = 0
		}
		setActiveIndex(newIndex);
	}

	const loadItems = () => () => {
		if (gallery.length > ITEMS_COUNT * timesLoaded) {
			let addTimesLoaded = timesLoaded + 1;

			gridRef.current.style.height = (parseInt(gridMaxHeight.replace('px', ''))-gridVPadding) * addTimesLoaded + 'px';
			setTimesLoaded(addTimesLoaded);
		}
	}

	return (
		<section className={`gallery-masonry__c f-col f-center masonry-grid cols-${COLUMNS} rows-${ROWS}`}>

			<div className={`gallery-masonry__modal fill-absolute f-center ${modalVisible ? 'open' :''}`}>
				<Layer className={`gallery-masonry__modal-background`} onClick={hideModal()} />
				<Icon icon="x-mark-oval" className="gallery-masonry__modal-hide" onClick={hideModal()} />
				
				<div className={`gallery-masonry__modal-gallery`}>
					<Icon 
						icon="chevron-left" 
						className={`nav-arrow left highlight primary ${activeIndex==0 ? 'disabled' :'' }`}
						onClick={updateIndex(activeIndex - 1)}
					/>

					<div className="gallery-masonry__modal-gallery-view carousel-view">
						<div className="carousel-slider" style={{ transform: `translateX(-${activeIndex * 100}%)`}}>
						{ gallery.map((item, index) => 
							<Image className="gallery-masonry__modal-slide f-full" src={item.imageSrc} />
						)}
						</div>
					</div>

					<Icon 
						icon="chevron-right" 
						className={`nav-arrow right highlight primary ${activeIndex==Math.ceil((gallery.length)-1) ? 'disabled' :'' }`}
						onClick={updateIndex(activeIndex + 1)}
					/>
				</div>
			</div>

			<div className="gallery-masonry__grid masonry-grid-container" ref={gridRef}>
				{ gallery.map((item, index) => index < ITEMS_COUNT*timesLoaded && 
					<Image 
						key={`gallery-item-${index}`}
						className={`gallery-masonry__grid-item masonry-grid-item item-${index+1}`} 
						src={item.imageSrc} 
						data-item-index={index}
						onClick={showModal(index)}
					/>
				)}
			</div>

			{ loadBtnText && 
				<div className="gallery-masonry__load-btn-wrapper f-center" onClick={loadItems()}>
					<a className="gallery-masonry__load-btn">{loadBtnText}</a> 
				</div>
			}
		</section>
	)
}

export default GalleryMasonry;