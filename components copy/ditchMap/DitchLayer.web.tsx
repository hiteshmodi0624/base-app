import { getDitchLayers } from '@/utils';
import { DitchLayerType } from './DitchLayers';
import React from 'react';
import { Layer, Source } from 'react-map-gl';
import useDitchMap from '@/hooks/useDitchMap';

const DitchLayer = ({ layer }: { layer: DitchLayerType }) => {
  const layers = getDitchLayers();
  const { satellite } = useDitchMap();
  return (
    <Source id={layer.source} data={layer.shape} key={layer.source} type="geojson">
      {layer.layers.map((l) =>
        l.type === 'line' ? (
          <Layer
            interactive={true}
            id={l.id}
            key={l.id}
            paint={{
              'line-color': l.style.lineColor,
              'line-width': l.style.lineWidth,
              'line-dasharray': l.style.lineDasharray ?? [],
            }}
            type={l.type}
            beforeId={satellite ? undefined : layers.find((layer) => layer.Name.startsWith('boy') || layer.Name.startsWith('day'))?.Name}
          />
        ) : l.type === 'fill' ? (
          <Layer
            interactive={true}
            id={l.id}
            key={l.id}
            paint={{
              'fill-color': l.style.fillColor,
              'fill-opacity': l.style.fillOpacity,
            }}
            type={l.type}
          />
        ) : (
          <></>
        ),
      )}
    </Source>
  );
};

export default DitchLayer;
