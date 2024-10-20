import { FillLayer, LineLayer, ShapeSource } from 'rnmapbox-ditch';
import { DitchLayerType } from './DitchLayers';
import React from 'react';
import useMapbox from '@/hooks/useMapbox';
import { getDitchLayers } from '@/utils';
import useDitchMap from '@/hooks/useDitchMap';

const DitchLayer = ({ layer, onPress, dontPress = false }: { layer: DitchLayerType; onPress?: () => void; dontPress?: boolean }) => {
  const { layerTapped } = useMapbox();
  const { styleLoaded, satellite } = useDitchMap();
  const layers = getDitchLayers();
  return (
    <ShapeSource
      id={layer.source}
      shape={layer.shape}
      onPress={
        dontPress
          ? undefined
          : onPress ||
            ((e) =>
              layerTapped(
                {
                  lat: e.coordinates.latitude,
                  lng: e.coordinates.longitude,
                },
                e.point,
                layer.source,
              ))
      }
      key={layer.source}
    >
      <>
        {layer.layers.map((l) => {
          if (l.type === 'line')
            return (
              <LineLayer
                id={l.id}
                key={l.id}
                style={l.style}
                sourceID={layer.source}
                belowLayerID={
                  styleLoaded === false || satellite
                    ? undefined
                    : layers.find((layer) => layer.Name.startsWith('boy') || layer.Name.startsWith('day'))?.Name
                }
              />
            );
          else if (l.type === 'fill') return <FillLayer id={l.id} key={l.id} style={l.style} sourceID={layer.source} />;
        })}
      </>
    </ShapeSource>
  );
};

export default DitchLayer;
