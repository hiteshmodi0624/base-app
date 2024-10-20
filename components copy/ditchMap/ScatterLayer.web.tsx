import useLayerFilters from '@/hooks/useLayerFilters';
import React from 'react';
import { Layer, useMap } from 'react-map-gl';

const ScatterLayer = () => {
  const { scatterFilter } = useLayerFilters();
  const { current } = useMap();
  const styles = current?.getStyle();
  const layer = styles?.layers.find((layer) => layer.id === scatterFilter.id)
  return (
    <>
      {layer !== undefined && (
        <Layer id={scatterFilter.id} filter={scatterFilter.filter} type="circle" source={(layer as unknown as any)['source-layer']} />
      )}
    </>
  );
};

export default ScatterLayer;
