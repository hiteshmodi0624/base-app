import React from 'react';
import { View, ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import CheckBox from 'react-native-check-box';
import AppText from '../typography/AppText';
import BlankButton from './button/BlankButton';

interface AppGridProps {
  loading: boolean;
  emptyMessage: string;
  selectedRows: number[];
  handleSelectionChange: React.Dispatch<React.SetStateAction<number[]>>;
  tableRows: GridRow[];
  tableCols: GridColumn[];
  onRowClick?: (b: GridRow) => void;
}

const AppGrid = ({
  loading,
  emptyMessage,
  selectedRows = [],
  handleSelectionChange,
  tableRows,
  tableCols,
  onRowClick,
}: AppGridProps) => {
  const renderItem: ListRenderItem<GridRow> = ({ item }) => {
    const toggleItemSelection = () =>
      handleSelectionChange((prev: number[]) => (prev.includes(item.id) ? prev.filter((p) => p !== item.id) : [...prev, item.id]));
    return (
      <BlankButton onClickHandler={() => (onRowClick ? onRowClick(item) : toggleItemSelection())}>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          }}
        >
          <CheckBox isChecked={selectedRows.includes(item.id)} onClick={toggleItemSelection} />
          {tableCols.map((col, i) => {
            const Cell = col.renderCell;
            type itemKey = keyof typeof item;
            return (
              <View
                key={i}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: col.width,
                  flex: col.flex,
                }}
              >
                {Cell ? (
                  <Cell row={item} />
                ) : (
                  <AppText
                    key={col.field}
                    text={item[col.field as itemKey]?.toString()}
                    fontSizeIndex={1}
                    textStyles={{ textAlign: 'center' }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </BlankButton>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (tableRows.length === 0 && emptyMessage) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText text={emptyMessage} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 10 }}>
        <CheckBox
          isChecked={selectedRows.length === tableRows.length}
          onClick={() => {
            handleSelectionChange(selectedRows.length === tableRows.length ? [] : tableRows.map((row) => row.id));
          }}
        />
        {tableCols.map((col) => {
          const Cell = col.renderCell;
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: col.width,
                flex: col.flex,
              }}
              key={col.field}
            >
              {Cell && selectedRows.length > 0 ? (
                <Cell
                  row={{
                    FriendlyName: '##DELETESELECTED##',
                    selectedItems: tableRows.filter((row) => selectedRows.find((sr) => sr === row.id)).map((row) => row.AppBlob),
                    id: 10000,
                    AppBlob: tableRows[0]?.AppBlob,
                  }}
                />
              ) : (
                <AppText key={col.field} text={col.headerName} fontSizeIndex={1} />
              )}
            </View>
          );
        })}
      </View>
      <FlatList
        data={tableRows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedRows}
        key={selectedRows.join()}
        pagingEnabled={true}
        horizontal={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default AppGrid;

export interface GridRow {
  id: number;
  AppBlob: any;
  FriendlyName?: string;
  FriendlyId?: number;
  InternalId?: number | undefined;
  TypeId?: number;
  waypoints?: number;
  placeTypeIndex?: number;
  date?: Date;
  selectedItems?: any[];
}

export interface GridColumn {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  renderCell?: (params: { row: GridRow }) => JSX.Element;
}
