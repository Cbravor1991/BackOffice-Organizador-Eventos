import React, { Component } from 'react';
import GoBack from '../components/GoBack';
import { useState } from "react";
import swal from "sweetalert2";


export class FileLoaderGallery extends Component {
    
    static contextTypes = {
       router: () => true,       
       }
       
    fileObj = [];
    fileArray = [];
    
    email_user = window.localStorage.getItem("username");
    
    constructor(props) {
        super(props)
            
        this.state = {
            file: [null],
            array: [],
            loaded: false
        }
        
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }
  
   
    upload = async () => {

       const CLOUD_NAME = 'dwx9rqfjh';
       const UPLOAD_PRESET = 'z87owhgv';
       const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`


        const data = new FormData();
        const urls = [];
        
        for (let i = 0; i < this.fileObj[0].length; i++) {
            
           data.append('file', this.fileObj[0][i]);
           data.append('upload_preset', UPLOAD_PRESET);
           data.append('cloud_name', CLOUD_NAME);
           

           await fetch(cloudinaryUrl,
               {method: "POST",
                   body: data})
               .then(async result => result.json())
               .then(async result => {this.state.array.push(result.secure_url)})
               .catch(err => console.log(err))
             }
             
        sessionStorage.setItem("urls",  JSON.stringify(this.state.array));
        window.localStorage.setItem("urls",  JSON.stringify(this.state.array));
        window.localStorage.setItem("foto_actualizada", true);
        console.log(this.state.array);
        this.state.loaded = true;
   
        swal.fire({
        title: "Has cargado las imágenes correctamente",
        icon: "success",
        customClass: {
          container: 'spotify-modal-container',
          popup: 'spotify-modal-popup',
          title: 'spotify-modal-title',
          content: 'spotify-modal-content',
          confirmButton: 'spotify-modal-button',
          cancelButton: 'spotify-modal-button'
        },
        showCloseButton: true,
        confirmButtonText: "Aceptar"
        }).then(function (result) {  
          window.location.href = "http://localhost:3000/imageLoader";
        });

    }
    
    uploadMultipleFiles(e) {
        
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {

            this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
        }
        this.setState({ file: this.fileArray })
    }
    
    
    uploadFiles (e) {
        e.preventDefault()
        e.currentTarget.disabled = true
        this.upload()
        console.log(this.state.file)

    }
    
   
    render() { 
        return (
            <section style={{ backgroundColor: 'black' }}>
              <div className="form-group multi-preview">
                {(this.fileArray || []).map((url) => (
                  <img src={url} alt="preview" height="150" />
                ))}
              </div>
              <br/>
              <div className="form-group">
                <input type="file" className="form-control" onChange={this.uploadMultipleFiles}
                  style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', color: "white" }}
                  multiple />
              </div>
              <br/>
              <button disabled={this.state.loaded} style={{ backgroundColor: '#1286f7', color: 'white', border: 'none', padding: '10px', borderRadius: '30px', cursor: 'pointer' }} onClick={this.uploadFiles}>
                Cargar fotos
              </button>
              <GoBack />
              <br/>
            </section>
          )
    }
}

export default FileLoaderGallery
