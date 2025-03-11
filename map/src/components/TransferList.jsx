'use client'
import { useEffect, useState } from 'react';

import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { Grid, TextField } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import permissionsData from './permissions.json';
// import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

// ----------------------------------------------------------------------

export function TransferList() {
  const [checked, setChecked] = useState([]);

  const [left, setLeft] = useState([])

  const [right, setRight] = useState([])
   
  const [filter,setFilter]=useState('')

  const leftChecked = intersection(checked, left);

  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);

    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
     const updatedPermissions={...permissionsData};
     leftChecked.forEach((item)=>{
         updatedPermissions[item]=true
     })
     console.log(updatedPermissions)

    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    const updatedPermissions={...permissionsData};
    rightChecked.forEach((item)=>{
        updatedPermissions[item]=true
    })
    console.log(updatedPermissions)
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleFilterChange=(e)=>{
    setFilter(e.target.value)
  }
  
  const filteredLeft = left.filter(item => item.toLowerCase().includes(filter.toLowerCase()));

  useEffect(()=>{
  const availablePermissions=Object.keys(permissionsData).filter((permission)=>!permissionsData[permission])
  const chosenPermissions=Object.keys(permissionsData).filter((permission)=>permissionsData[permission])
  setLeft(availablePermissions)
  setRight(chosenPermissions)


  },[])

  const customList = (title, items) => (
    <Card sx={{ borderRadius: 1.5 }}>
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'All items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
        sx={{ p: 2 }}
      />

      <Divider />

      <List dense component="div" role="list" sx={{ width: 200, overflow: 'auto' }}>
        {items.map((value) => (
          <ListItemButton key={value} role="listitem" onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                disableRipple
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                inputProps={{ 'aria-labelledby': `transfer-list-all-item-${value}-label` }}
              />
            </ListItemIcon>
            <ListItemText
              id={`transfer-list-all-item-${value}-label`}
              primary={`Register | ${value.replace(/_/g, ' | ')}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Card>
  );

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ width: 'auto', p: 3 }}>
      <Grid item xs={12} sm={5}>
         <TextField
            label="Filter"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={handleFilterChange}
            sx={{ mb: 2 }}
         />
        {customList('Available Permissions', filteredLeft)}
        </Grid>
        <Grid container direction="column" alignItems="center" sx={{ p: 3 }}>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
          sx={{ my: 1 }}
        >
          &gt;
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
          sx={{ my: 1 }}
        >
          &lt;
        </Button>
        </Grid>
        <Grid item xs={12} sm={5}>
        {customList('Chosen Permissions', right)}
      </Grid>
    </Grid>
  );
}
