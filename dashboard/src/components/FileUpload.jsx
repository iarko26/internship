"use client";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormHelperText, Box, IconButton } from "@mui/material";
import UploadAvatar from "./UploadAvatar";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FieldUpload({ name, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles) => {
          const value = acceptedFiles[0];
          setValue(name, value, { shouldValidate: true });
        };

        const onRemove = () => {
          setValue(name, null, { shouldValidate: true });
        };

        const onView = () => {
          if (field.value) {
            const imageUrl =
              field.value instanceof File ? URL.createObjectURL(field.value) : field.value;

            const newTab = window.open();
            if (newTab) {
              const img = newTab.document.createElement('img');
              img.src = imageUrl;
              img.style.width = '100%';
              newTab.document.body.appendChild(img);
              newTab.document.title = 'Preview Image';
            } else {
              alert('Popup blocked! Please allow popups to view the image.');
            }
          }
        };

        return (
          <div>
            <UploadAvatar
              error={!!error}
              value={field.value}
              onChange={(file) => {
                field.onChange(file);
              }}
              helperText={
                error && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {error.message}
                  </FormHelperText>
                )
              }
              {...other}
            />

            {field.value && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  my: 7,
                  mx: 2,
                  display: 'flex',
                }}
              >
                <IconButton onClick={onView} color="primary">
                  <VisibilityIcon />
                </IconButton>

                <IconButton onClick={onRemove} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </div>
        );
      }}
    />
  );
}