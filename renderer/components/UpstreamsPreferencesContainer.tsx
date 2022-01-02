import React from "react";
import {
  Button,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DogBreadsIcon from "./DogBreadsIcon";
import DeleteDialog from "./upstreamSettingDialogs/DeleteDialog";
import AddOrEditDialog from "./upstreamSettingDialogs/AddOrEditDialog";

const UpstreamsPreferencesContainer: React.FC = () => {
  const [upstreams, setUpstreams] = React.useState<UpstreamType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // 初回レンダリング時に、設定情報を画面に反映する
  React.useEffect(() => {
    (async () => {
      const upstreamsPreference = await window.store.getUpstreamsPreference();
      setUpstreams(upstreamsPreference.upstreams);
    })();
  }, []);

  const updateUpstreamsPreference = (preference: UpstreamsPreferenceType) => {
    window.store.setUpstreamsPreference(preference);
    setUpstreams(preference.upstreams);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  const addSetting = React.useCallback(
    async (newSetting: UpstreamType) => {
      const currentPreference = await window.store.getUpstreamsPreference();
      const newSelectedIndex = currentPreference.selectedIndex;
      const newUpstreams = upstreams.concat(newSetting);

      updateUpstreamsPreference({
        selectedIndex: newSelectedIndex,
        upstreams: newUpstreams,
      });
    },
    [upstreams]
  );

  const openEditDialog = () => {
    setIsEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };
  const handleEdit = React.useCallback((index: number) => {
    setSelectedIndex(index);
    openEditDialog();
  }, []);
  const editSetting = React.useCallback(
    async (index: number, newSetting) => {
      const currentPreference = await window.store.getUpstreamsPreference();
      const newSelectedIndex = currentPreference.selectedIndex;
      const newUpstreams = upstreams.slice();
      newUpstreams[index] = newSetting;

      updateUpstreamsPreference({
        selectedIndex: newSelectedIndex,
        upstreams: newUpstreams,
      });
    },
    [upstreams]
  );

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleDelete = React.useCallback((index: number) => {
    setSelectedIndex(index);
    openDeleteDialog();
  }, []);
  const deleteSetting = React.useCallback(
    async (index: number) => {
      const currentPreference = await window.store.getUpstreamsPreference();
      const newIndex: number = ((deletedIndex, selectedIndex) => {
        // 選択されている設定を消す場合は、0番目の設定に変更
        // それ以外の場合は、選択されている設定が変わらないようにする
        if (deletedIndex == selectedIndex) {
          return 0;
        } else if (deletedIndex < selectedIndex) {
          return selectedIndex - 1;
        } else {
          return selectedIndex;
        }
      })(index, currentPreference.selectedIndex);
      const newUpstreams = [
        ...upstreams.slice(0, index),
        ...upstreams.slice(index + 1),
      ];

      updateUpstreamsPreference({
        selectedIndex: newIndex,
        upstreams: newUpstreams,
      });
    },
    [upstreams]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Tooltip title="追加">
        <Button
          sx={{ textTransform: "none", float: "right" }}
          variant="text"
          color="primary"
          onClick={() => {
            openAddDialog();
          }}
        >
          <AddIcon />
        </Button>
      </Tooltip>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell> {/* icon */} </TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Host</TableCell>
            <TableCell align="center">Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upstreams.map((upstream, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                <DogBreadsIcon iconId={upstream.icon} style="lineal" />
              </TableCell>
              <TableCell>
                <Typography noWrap>{upstream.name}</Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <BadgeOutlinedIcon
                    fontSize="small"
                    sx={{
                      visibility: upstream.connectionSetting?.credentials
                        ? "visible"
                        : "hidden",
                      mr: (theme) => theme.spacing(1),
                    }}
                  />
                  <Typography noWrap>
                    {upstream.connectionSetting?.host ?? ""}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>
                  {upstream.connectionSetting?.port ?? ""}
                </Typography>
              </TableCell>
              <TableCell>
                <Tooltip title="編集">
                  <EditIcon
                    color="primary"
                    onClick={() => {
                      handleEdit(index);
                    }}
                  />
                </Tooltip>
              </TableCell>

              {0 < index && (
                <TableCell>
                  <Tooltip title="削除">
                    <DeleteIcon
                      color="primary"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    />
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddDialogOpen && (
        <AddOrEditDialog onDismiss={closeAddDialog} onConfirm={addSetting} />
      )}

      {isEditDialogOpen && (
        <AddOrEditDialog
          oldUpstream={upstreams[selectedIndex]}
          onDismiss={() => {
            closeEditDialog();
          }}
          onConfirm={(newUpstream: UpstreamType) => {
            editSetting(selectedIndex, newUpstream);
          }}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteDialog
          upstream={upstreams[selectedIndex]}
          onDismiss={() => {
            closeDeleteDialog();
          }}
          onConfirm={() => {
            deleteSetting(selectedIndex);
          }}
        />
      )}
    </Box>
  );
};

export default UpstreamsPreferencesContainer;
