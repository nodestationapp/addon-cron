import { useFormik } from "formik";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";

import CodeEditor from "./CodeEditor.js";
import { useCrons } from "../contexts/crons.js";

const CronEditorModal = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { addCron } = useCrons();

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (open?.id) {
        values.id = open?.id;
      }

      await addCron(values);

      onClose();
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: open?.name,
      expression: open?.expression,
      content: open?.content,
    },
    onSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: 830,
          width: "100%",
          ...(fullScreen && {
            borderRadius: 0,
          }),
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          pb: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack gap={2} direction="column" sx={{ height: "100%" }}>
          <Stack
            gap={2}
            direction="column"
            sx={{ p: 1.5, pb: 0, flexShrink: 0 }}
          >
            <TextField
              fullWidth
              type="text"
              name={"name"}
              label={"Name"}
              required={true}
              variant="outlined"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              error={!!formik?.errors?.name}
              helperText={formik?.errors?.name}
            />
            <TextField
              fullWidth
              type="text"
              required={true}
              name={"expression"}
              label={"Expression"}
              variant="outlined"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.expression}
              error={!!formik?.errors?.expression}
              helperText={formik?.errors?.expression}
            />
          </Stack>
          <CodeEditor
            language="js"
            value={formik.values.content}
            onChange={(value) => formik.setFieldValue("content", value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1.5, pt: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        {process.env.NODE_ENV === "development" && (
          <Button
            onClick={formik.submitForm}
            variant="contained"
            loading={formik.isSubmitting}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CronEditorModal;
