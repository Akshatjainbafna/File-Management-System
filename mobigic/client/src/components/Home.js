import React, { useEffect, useState, useRef } from 'react'
import Cookies from 'js-cookie'
import { LoginFunc, UploadFunc, LogoutFunc } from '../api'
import DirectoryComponent from './DirectoryComponent'

const Home = () => {

    const ref = useRef();

    const [cookie, setcookie] = useState(false)
    const [username, setusername] = useState()
    const [password, setpassword] = useState()
    const [addFile, setaddFile] = useState()
    const [FileArray, setFileArray] = useState([])

    //Check if user is logged in
    useEffect(() => {
        if (Cookies.get('token')) {
            setcookie(true)
        } else {
            setcookie(false)
        }

        if (localStorage.getItem('file') == null) {
            localStorage.setItem('file', JSON.stringify([]))
        } else {
            setFileArray(JSON.parse(localStorage.getItem('file')))
        }
    }, [])

    useEffect(() => {
        if (FileArray.length > 1) {
            localStorage.setItem('file', JSON.stringify(FileArray))
        }

    }, [FileArray])


    //logout user
    const logout = async () => {
        const logout = await LogoutFunc()
        if (logout) {
            setcookie(false)
            localStorage.setItem('file', JSON.stringify([]))
            setusername('')
            setpassword('')
        }
    }

    //login user
    const login = async () => {
        if (username && password) {
            const UserLog = await LoginFunc(username, password)
            if (UserLog) {
                setcookie(true)
                setFileArray(UserLog.User.files)
            }
        }
    }

    //submitFile 
    const fileSubmit = async () => {
        if (addFile) {
            const formData = new FormData();
            formData.append("file", addFile);
            const UserLog = await UploadFunc(formData)
            setFileArray(UserLog.User.files)
            ref.current.value = ""
            setaddFile('')
        }
    }

    return (
        <div className='d-flex flex-column'>
            <div className='pt-4 pb-2'>
                <div className="fw-bold fs-5 text-center">File Directory</div>
            </div>
            <div className='p-4 d-flex justify-content-around'>
                <span className='flex-grow'>
                    {cookie ?
                        <span className='d-flex'>
                            <input type="file" ref={ref} name='fileupload' className="form-control" onChange={(e) => setaddFile(e.target.files[0])} />
                            <button className='btn btn-outline-primary' disabled={addFile ? false : true} onClick={() => fileSubmit()} >Save</button>
                        </span>
                        :
                        <>
                            Please login no need to register
                            <input type='text' name='mobigic_username' placeholder='Enter Username' className='form-control py-2 my-2' value={username} onChange={(e) => setusername(e.target.value.trim())} />
                            <input type='text' name='mobigic_password' placeholder='Enter Password' className='form-control py-2 my-2' value={password} onChange={(e) => setpassword(e.target.value.trim())} />
                        </>
                    }

                </span>
                <span className=''>
                    <button className='btn btn-outline-primary float-end' onClick={() => cookie ? logout() : login()} >{cookie ? "Logout" : "Login"}</button>
                </span>
            </div>
            {cookie && <div className='my-3 mx-auto' style={{width: '80vw'}}>
                <DirectoryComponent FileArray={FileArray} setFileArray={setFileArray} />
            </div>}
        </div>
    )
}

export default Home