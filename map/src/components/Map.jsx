"use client";

import { useMemo, useState, useEffect } from "react";
import { Geography, Geographies, ComposableMap } from "react-simple-maps";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import districtsData from '../components/districts.json';

export function OverviewView() {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [highlightedDistricts, setHighlightedDistricts] = useState([]);

   const districtNameMapping=useMemo(
    ()=>({
      Dhaka: "Empowering urban youth, Dhaka, 2015-2023, 2500",
      Chattogram: "Fisheries development program, Chittagong, 2010-2018, 1870",
      Rangpur: "Women empowerment program, Rangpur, 2013-2021, 950",
      Khulna: "Agriculture development program, Khulna, 2011-2019, 1200",
      Barisal: "Education development program, Barisal, 2012-2020, 800",
      Sylhet: "Health development program, Sylhet, 2014-2022, 700",
      Rajshahi: "Infrastructure development program, Rajshahi, 2016-2024, 600",
      Mymensingh: "Water development program, Mymensingh, 2017-2025, 500",
      Comilla: "Energy development program, Comilla, 2018-2026, 400",
    }),
    []
   )

  useEffect(() => {
    setHighlightedDistricts(Object.keys(districtNameMapping));
   

  }, [districtNameMapping]);

  const handleMouseEnter = (districtName, event) => {
     setHoveredDistrict(districtNameMapping[districtName] || `Distrct: ${districtName}`);
     const { clientX, clientY } = event;
     setTooltipPosition({ x: clientX, y: clientY });
    };

  const handleMouseLeave = () => {
    setHoveredDistrict(null);
  };

  const formatTooltipData = (data) =>
    data.split(",").map((line, index) => (
      <Typography key={index} variant="body2">
        {line}
      </Typography>
    ));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box position="relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [90.3563, 23.685],
              scale: 5000,
            }}
            style={{ width: "100%", height: "500px" }}
          >
            <Geographies geography={districtsData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const districtName = geo.properties.ADM2_EN;
                  const isHighlighted =
                    highlightedDistricts.includes(districtName);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(event) =>
                        handleMouseEnter(districtName, event)
                      }
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isHighlighted ? "#ff7043" : "#e0e0e0",
                          outline: "none",
                          stroke: "#424242",
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: "#ff5722",
                          outline: "none",
                        },
                        pressed: {
                          fill: "#ff5722",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {hoveredDistrict && (
            <Box
              sx={{
                position: "absolute",
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y - 40}px`,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
                maxWidth: "300px",
                zIndex: 1000,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                pointerEvents: "none",
              }}
            >
              {formatTooltipData(hoveredDistrict)}
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}