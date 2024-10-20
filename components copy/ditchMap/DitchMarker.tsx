import React, { useEffect, useRef } from 'react';
import useMapbox from '@/hooks/useMapbox';
import { getImageSource } from '@/utils';
import Mapbox from 'rnmapbox-ditch';
import DitchImage from '../ui/DitchImage';
import useMarkerFeatures from '@/hooks/useMarkerFeatures';
import { Animated, Platform, View } from 'react-native';
import { getPointInView } from '@/hooks/useMapboxLibraries';
import DitchText from '../typography/DitchText';
import usePrefs from '@/hooks/usePrefs';

const DitchMarker = ({ feature }: { feature: WaypointInterface | DitchBlobInterface }) => {
  
  const { featureTapped, featureDragging } = useMapbox();
  const {prefs} = usePrefs()
  const { markerSize, markerCurrentIcon, handleDragEnd, handleDragStart, annotationId } = useMarkerFeatures(feature);
  const animatedSize = useRef(new Animated.Value(25)).current;
  const markerRef = useRef<Mapbox.PointAnnotation | null>(null);
  const coordinate = [+feature.Longitude, +feature.Latitude];
  useEffect(() => {
    Animated.timing(animatedSize, {
      toValue: markerSize,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [markerSize, animatedSize]);
  return (
    <Mapbox.PointAnnotation
      id={`${annotationId}`}
      coordinate={coordinate}
      draggable={true}
      onDrag={(e) => featureDragging(e.geometry.coordinates as GeoJSONPoint)}
      onDragStart={handleDragStart}
      onDragEnd={() => handleDragEnd(feature)}
      onSelected={async () => {
        featureTapped(await getPointInView(coordinate), feature);
      }}
      ref={(ref) => {
        markerRef.current = ref;
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <DitchImage
          key={`${annotationId} ${markerSize}`}
          image={getImageSource(markerCurrentIcon)}
          size={markerSize}
          onLoad={() => {
            if (markerRef.current) markerRef.current.refresh();
          }}
          imageStyle={{ zIndex: 1 }}
        />
        {prefs.ShowMarkerLabels && 'FriendlyName' in feature && feature.FriendlyName && markerSize >= 25 && Platform.OS !== 'android' && (
          <DitchText text={feature.FriendlyName} fontSizeIndex={0} key={`${feature.FriendlyName} ${prefs.ShowMarkerLabels}`} />
        )}
      </View>
    </Mapbox.PointAnnotation>
  );
};

export default DitchMarker;
