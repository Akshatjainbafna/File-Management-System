import React, { Fragment, useEffect, useState } from 'react'
import { DeleteFunc, DownLoadFunc } from "../api"

const DirectoryComponent = (props) => {
    const { FileArray, setFileArray } = props

    //Delete file
    const deletImg = async (flname) => {
        const UserLog = await DeleteFunc(flname)
        localStorage.setItem('file', JSON.stringify(UserLog.User.files))
        setFileArray(UserLog.User.files)
    }

    //Download File
    const downloadFile = (code, flName) => {
        let inputCode = prompt("Please enter 6 digit code to proceed");
        if (inputCode == null || inputCode == "") {
            console.log("Download Halt.")
        } else {
            if(inputCode == code){
                const dwn =  DownLoadFunc(flName)
            }else{
                alert('Wrong Code')
            }
        }
    }
    return (

        <table className='table table-hover'>
            <thead className='thead-light'>
                <tr>
                    <th >#</th>
                    <th>File name</th>
                    <th>Actions</th>
                    <th>Code</th>
                </tr>
            </thead>
            <tbody>
                {
                    FileArray && FileArray.map((value, index) => {
                        return (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{value.flName}</td>
                                <td className='d-flex'>
                                    <button className='mx-1 btn btn-success' onClick={() => downloadFile(value.code, value.flName)}>Download</button>
                                    <button className='mx-1 btn btn-danger' onClick={() => deletImg(value.flName)}>Delete</button>
                                </td>
                                <td>{value.code}</td>
                            </tr>

                        )
                    })
                }
            </tbody>
        </table>

    )
}

export default DirectoryComponent