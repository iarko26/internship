import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';

import { Iconify } from '../iconify';
import { UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

export function FieldUpload({ name, ...other }) {
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
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

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
                  <Iconify icon="solar:eye-bold" />
                </IconButton>

                <IconButton onClick={onRemove} color="error">
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Box>
            )}

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}
