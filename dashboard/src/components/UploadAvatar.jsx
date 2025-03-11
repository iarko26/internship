"use client";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import Iconify from "./Iconify";

export default function UploadAvatar({
  sx,
  error,
  value,
  onChange,
  disabled,
  helperText,
  className,
  ...other
}) {
  const [preview, setPreview] = useState("");
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({ 
    unit: '%', 
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 1 
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [imageRef, setImageRef] = useState(null);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    disabled,
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setCurrentImage(URL.createObjectURL(file));
        setOpenCropDialog(true);
      }
    },
    ...other,
  });

  const hasFile = !!value;
  const hasError = isDragReject || !!error;

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
    }
  }, [value]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      if (currentImage && currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
    };
  }, [preview, currentImage]);

  const onImageLoad = useCallback((img) => {
    setImageRef(img);
  }, []);

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCancel = () => {
    setOpenCropDialog(false);
    if (currentImage) {
      URL.revokeObjectURL(currentImage);
      setCurrentImage(null);
    }
  };

  const handleApply = async () => {
    if (!completedCrop || !imageRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate the scaled dimensions
    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    // Apply rotation if needed
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Draw the cropped image
    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    ctx.restore();
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        if (onChange) {
          onChange(file);
        }
        setPreview(URL.createObjectURL(file));
        setOpenCropDialog(false);
        setCurrentImage(null);
      }
    }, 'image/jpeg', 0.95);
  };

  const renderPreview = hasFile && preview ? (
    <img
      alt="avatar"
      src={preview}
      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
    />
  ) : null;

  const renderPlaceholder = (
    <Box
      className="upload-placeholder"
      sx={{
        top: 0,
        gap: 1,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        display: "flex",
        borderRadius: "50%",
        position: "absolute",
        alignItems: "center",
        color: "text.disabled",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: "rgba(0, 0, 0, 0.08)",
        transition: "opacity 0.3s",
        "&:hover": { opacity: 0.72 },
        ...(hasError && {
          color: "error.main",
          bgcolor: "rgba(255, 0, 0, 0.08)",
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: "common.white",
          bgcolor: "rgba(0, 0, 0, 0.64)",
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">
        {hasFile ? "Update photo" : "Upload photo"}
      </Typography>
    </Box>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: "hidden",
        borderRadius: "50%",
        position: "relative",
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  return (
    <>
      <Box
        {...getRootProps()}
        className={className}
        sx={{
          p: 1,
          m: "auto",
          width: 144,
          height: 144,
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: "50%",
          border: "1px dashed rgba(0, 0, 0, 0.2)",
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: "none" }),
          ...(hasError && { borderColor: "error.main" }),
          ...(hasFile && {
            ...(hasError && {
              bgcolor: "rgba(255, 0, 0, 0.08)",
            }),
            "&:hover .upload-placeholder": { opacity: 1 },
          }),
          ...sx,
        }}
      >
        <input {...getInputProps()} />
        {renderContent}
      </Box>

      {helperText && helperText}

      <Dialog 
        open={openCropDialog} 
        onClose={handleCancel}
        maxWidth="md"
        PaperProps={{ 
          sx: { 
            width: '100%',
            maxWidth: 600
          } 
        }}
      >
        <DialogTitle>Resize and Crop Image</DialogTitle>
        <DialogContent>
          {currentImage && (
            <>
              <ReactCrop
                src={currentImage}
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={handleCropComplete}
                aspect={1}
                circularCrop
              >
                <img 
                  src={currentImage} 
                  onLoad={(e) => onImageLoad(e.target)} 
                  style={{ 
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    maxWidth: '100%', 
                    maxHeight: '400px' 
                  }} 
                  alt="Crop preview" 
                />
              </ReactCrop>
              
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Zoom</Typography>
                <Slider
                  value={scale}
                  onChange={(e, newValue) => setScale(newValue)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  aria-labelledby="Scale"
                />
                
                <Typography gutterBottom sx={{ mt: 2 }}>Rotate</Typography>
                <Slider
                  value={rotate}
                  onChange={(e, newValue) => setRotate(newValue)}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotate"
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}