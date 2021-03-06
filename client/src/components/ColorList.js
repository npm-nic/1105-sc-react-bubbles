import React, { useState, useHistory } from 'react';
import axios from 'axios';
import { axiosWithAuth } from '../utils/axiosWIthAuth';

const initialColor = {
  color: '',
  code: { hex: '' },
};

const ColorList = ({ colors, updateColors }) => {
  console.log('colors', colors);
  // const { push } = useHistory();
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = (color) => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      // console.log(colorToEdit.id)
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then((res) => {
        // console.log('ColorList -> res', res.data);
        setEditing(false);
        const editedColorsList = colors.map((c) => {
          if (c.id === colorToEdit.id) {
            return res.data;
          } else {
            return c;
          }
        });
        updateColors(editedColorsList);
      })
      .catch((err) => {
        console.log(
          'ColorList -> error:',
          err.response.status,
          err.response.statusText
        );
      });
  };

  const deleteColor = (color) => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then((res) => {
        console.log('handleSubmit -> res', res.data);
        colors = colors.filter((color) => color.id !== res.data);
        updateColors(colors);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='colors-wrap'>
      <p>colors</p>
      <ul>
        {colors.map((color) => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className='delete'
                onClick={(e) => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{' '}
              {color.color}
            </span>
            <div
              className='color-box'
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={(e) =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={(e) =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className='button-row'>
            <button type='submit'>save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
          <pre>{JSON.stringify(colorToEdit, null, 2)}</pre>v
        </form>
      )}
      <div className='spacer' />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
