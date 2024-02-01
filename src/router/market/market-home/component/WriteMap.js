import { useEffect, useRef, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";


function KakaoMap({geoLatLng, setGeoLatLng}) {
    const [ placeInfoOpen, setPlaceInfoOpen ] = useState(false);
    const mapRef = useRef(null);
    

    return(
        <div>
            <Map
              center={{ lat: geoLatLng[0], lng: geoLatLng[1] }}
              style={{ width: "100%", height: "360px" }}
              ref={mapRef}
              level={4}
              onClick={(_,mouseEvent)=>{
                const latlng = mouseEvent.latLng;
                setGeoLatLng([latlng.getLat(), latlng.getLng()]);
              }}
            >
                <MapMarker position={{ lat: geoLatLng[0], lng: geoLatLng[1] }} onClick={()=>setPlaceInfoOpen((prev)=>!prev)}>
                    {placeInfoOpen &&
                    <CustomOverlayMap position={{ lat: geoLatLng[0], lng: geoLatLng[1] }}>
                        
                    </CustomOverlayMap>
                    }
                </MapMarker>
            </Map>
        </div>
    );
};

export default KakaoMap;