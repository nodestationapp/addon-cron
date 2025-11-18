import { useState } from "react";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CronEditorModal from "#client/components/CronEditorModal.js";

import MuiTable from "@nstation/tables/client/components/MuiTable/index.js";

import { useCrons } from "#client/contexts/crons.js";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import { useUpdateQueryParam } from "@nstation/design-system/hooks";

const Crons = () => {
  const updateQueryParam = useUpdateQueryParam();

  const { crons, loading, deleteCron, sort } = useCrons();
  const [cron_editor_modal, setCronEditorModal] = useState(false);

  const deleteHandler = async (ids) => {
    try {
      for await (const id of ids) {
        await deleteCron(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sortHandler = (sort) => {
    updateQueryParam(
      "sort",
      !!sort?.length ? `${sort?.[0]?.field}:${sort?.[0]?.sort}` : undefined
    );
  };

  const action = () => (
    <>
      {process.env.NODE_ENV === "development" && (
        <Button
          size="small"
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCronEditorModal(true)}
        >
          New
        </Button>
      )}
    </>
  );

  const selectActions = (selectedRows) => {
    return (
      <Tooltip title="Delete">
        <IconButton size="micro" onClick={() => deleteHandler(selectedRows)}>
          <DeleteOutline sx={{ color: "error.light" }} />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <>
      <MuiTable
        page={1}
        views={[
          {
            name: "Crons",
            href: "/crons",
          },
        ]}
        sort={
          !!sort
            ? [
                {
                  field: sort?.split(":")[0],
                  sort: sort?.split(":")[1],
                },
              ]
            : null
        }
        setSort={sortHandler}
        action={action}
        loading={loading}
        noAddTab
        columns={[
          {
            flex: 1,
            name: "Name",
            slug: "name",
            headerName: "Name",
            renderCell: (params) => params?.value,
          },
          {
            flex: 1,
            name: "Status",
            slug: "active",
            headerName: "Status",
            type: "select",
            variant: "single",
            options: [
              {
                color: "success",
                label: "active",
                value: true,
              },
              {
                color: "error",
                label: "inactive",
                value: false,
              },
            ],
          },
          {
            flex: 1,
            name: "Expression",
            slug: "expression",
            headerName: "Expression",
            renderCell: (params) => params?.value,
          },
          {
            flex: 1,
            name: "Last executed",
            slug: "last_executed",
            headerName: "Last executed",
            type: "date",
            renderCell: (params) => params?.value,
          },
        ]}
        rows={crons?.data}
        selectActions={selectActions}
        pagination={crons?.meta}
        onRowClick={({ row }) => setCronEditorModal(row)}
      />
      {cron_editor_modal && (
        <CronEditorModal
          open={cron_editor_modal}
          onClose={() => setCronEditorModal(false)}
        />
      )}
    </>
  );
};

export default Crons;
