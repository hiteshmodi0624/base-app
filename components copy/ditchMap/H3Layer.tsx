import useH3 from '@/hooks/useH3';
import { useEffect } from 'react';
import DitchLayer from './DitchLayer';
import React from 'react';
import useDitchMap from '@/hooks/useDitchMap';
import { log } from '@/utils';

const H3Layer = () => {
  const { H3Layers, createH3Polygon, selectH3, selectedH3 } = useH3();
  const { lastZoom, lastLocation } = useDitchMap();

  useEffect(() => {
    createH3Polygon();
    log(lastLocation);
  }, [lastZoom, lastLocation]);

  return H3Layers.map((layer) => {
    const layers = [...layer.layers];
    const selectedId = `${layer.source}-selected`;
    if (selectedH3.includes(layer.source)) {
      layers.push({
        id: selectedId,
        type: 'fill',
        style: {
          fillOutlineColor: ['get', 'color'],
          fillColor: ['get', 'color'],
          fillOpacity: 0.5,
        },
      });
    }
    return <DitchLayer layer={{ ...layer, layers }} key={layer.source} onPress={() => selectH3(layer.source)} dontPress/>;
  });
};
export default H3Layer;
