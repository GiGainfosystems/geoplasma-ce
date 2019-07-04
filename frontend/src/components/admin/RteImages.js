import React, { Component } from 'react'
import {
  ImageSideButton,
  Block,
  addNewBlock,
  createEditorState,
  Editor,
} from 'medium-draft';
import Cookies from 'universal-cookie';
import config from '../../config'
const cookies = new Cookies();

class CustomImageSideButton extends ImageSideButton {

  /*
  We will only check for first file and also whether
  it is an image or not.
  */
  onChange(e) {
      let token = cookies.get('token')
    const file = e.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      // This is a post request to server endpoint with image as `image`
      const formData = new FormData();
      formData.append('image', file);
      fetch(config.apiBaseUrl+'api/superuser/upload?token='+token, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      }).then((response) => {
        if (response.status === 200) {
          // Assuming server responds with
          // `{ "url": "http://example-cdn.com/image.jpg"}`

          return response.json().then(data => {

            if (data.url) {

              this.props.setEditorState(addNewBlock(
                this.props.getEditorState(),
                Block.IMAGE, {
                  src: data.url,
                }
              ));
            }
          });
        }
      });
    }
    this.props.close();
  }

}

export default CustomImageSideButton
