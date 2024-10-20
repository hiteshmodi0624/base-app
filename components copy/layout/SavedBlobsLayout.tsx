import React, { useState, useEffect } from 'react';
import DitchGrid, { GridColumn, GridRow } from '../ui/DitchGrid';
import useDitchMap from '../../hooks/useDitchMap';
import PageLayout from './PageLayout';
import { log } from '@/utils';

interface SavedBlobsLayoutProps {
  blobs: DitchBlobInterface[];
  title: string;
  columns: GridColumn[];
  actions: GridColumn[];
  viewBlob?: (e: DitchBlobInterface) => void;
  rightButton?: React.ReactNode;
}

function SavedBlobsLayout({ blobs, columns, actions, title, viewBlob, rightButton }: SavedBlobsLayoutProps) {
  const [tableRows, setTableRows] = useState<GridRow[] | undefined>();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [emptyMessage, setEmptyMessage] = useState(`No ${title} Found`);
  const { refreshMapCounter } = useDitchMap();

  useEffect(() => {
    const fetchSavedBlobs = async () => {
      try {
        const mappedRows = blobs.map((blob) => ({
          id: blob.FriendlyId ?? blob.InternalId,
          DitchBlob: blob,
          FriendlyName: blob.FriendlyName,
          FriendlyId: blob.FriendlyId,
          InternalId: blob.InternalId ?? blob.FriendlyId,
          TypeId: blob.TypeId,
          waypoints: blob.waypoints.length,
          placeTypeIndex: blob.DitchBlob.PlaceTypeIndex,
          date: new Date(blob.Updated ?? ''),
        }));
        setTableRows(mappedRows);
      } catch (error) {
        log('Error fetching blobs:', error);
        setEmptyMessage('Failed to load blobs. Please try again.');
      }
    };

    fetchSavedBlobs();
  }, [blobs, refreshMapCounter]);

  const onRowClick = (e: GridRow) => {
    if (viewBlob) {
      viewBlob(e.DitchBlob);
    }
  };
  return (
    <PageLayout title={title} notScrollable={false} showBackButton showFullScreen rightButton={rightButton}>
      <DitchGrid
        emptyMessage={emptyMessage}
        handleSelectionChange={setSelectedRows}
        loading={tableRows === undefined}
        selectedRows={selectedRows}
        tableCols={[...columns, ...actions]}
        tableRows={tableRows ?? []}
        onRowClick={viewBlob && onRowClick}
      />
    </PageLayout>
  );
}

export default SavedBlobsLayout;
