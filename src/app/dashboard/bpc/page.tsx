"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

// const roles = ['Market', 'Finance', 'Development'];
const rownumber = ['1', '2', '3','4'];
const number_of_nodes = ['12', '23', '34','42'];
const number_of_flowers = ['23', '13', '32','21'];
const number_of_leaves = ['13', '223', '123','432'];
const number_of_fruits = ['13', '23', '2','43'];
const plantWidth = ['21','231','34','55'];
const plantHeight = ['21','231','34','55'];
// const randomRole = () => {
//   return randomArrayItem(roles);
// };

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
  {
    id: randomId(),
    rownumber: randomArrayItem(rownumber),
    number_of_nodes: randomArrayItem(number_of_nodes),
    number_of_flowers: randomArrayItem(number_of_flowers),
    number_of_leaves: randomArrayItem(number_of_leaves),
    number_of_fruits:randomArrayItem(number_of_fruits),
    plant_width:randomArrayItem(plantWidth),
    plant_height:randomArrayItem(plantHeight)
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, rownumber: '', number_of_nodes: '', number_of_flowers:'',number_of_leaves:'', number_of_fruits:'',plant_width:'',plant_height:''}]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'rownumber' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    // { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'rownumber',
      headerName: 'Row Number',
      type: 'number',
      width: 100,
      align: 'left',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'number_of_nodes',
      headerName: 'Number of Nodes',
      type: 'number',
      width: 130,
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'number_of_leaves',
      headerName: 'Number of Leaves',
      type: 'number',
      headerAlign: 'left',
      width: 130,
      editable: true,
    },
    {
      field: 'number_of_flowers',
      headerName: 'Number of Flowers',
      type: 'number',
      headerAlign: 'left',
      width: 130,
      editable: true,
    },
    {
      field: 'number_of_fruits',
      headerName: 'Number of Fruits',
      type: 'number',
      headerAlign: 'left',
      width: 130,
      editable: true,
    },
    {
      field: 'plant_height',
      headerName: 'Plant Height (cm)',
      type: 'number',
      width: 100,
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'plant_width',
      headerName: 'Plant Width (cm)',
      type: 'number',
      headerAlign: 'left',
      width: 100,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      headerAlign: 'left',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      <Button variant="contained">Submit</Button>
    </Box>
  );
}
