"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import FieldUpload from "./FileUpload";
import Button from "@mui/material/Button";
import { Box, Typography, Paper } from "@mui/material";

const ImageUpload = () => {
  const methods = useForm();

  const onSubmit = (data) => {
    console.log("Image data:", data);
    if (data.image) {
      console.log("Image file:", data.image);
      
    }
  };

  return (
    <FormProvider {...methods}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          mx: "auto",
          mt: 5,
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Upload Your Profile Picture
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click on the circle below to upload an image. You can resize, crop, rotate, and zoom your photo.
        </Typography>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <FieldUpload name="image" />
          </Box>
          <Button variant="contained" type="submit" color="primary">
            Submit
          </Button>
        </form>
      </Paper>
    </FormProvider>
  );
};

export default ImageUpload;