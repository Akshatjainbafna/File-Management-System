import axios from 'axios'

const request = new axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true,
    timeout: 2000,
    headers: {
        Accept: 'application/json',
        'Contetnt-Type': 'multipart/form-data'
    },
})

const downloadRequest = new axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Contetnt-Type': 'multipart/form-data'
    },
    responseType: 'blob'
})

export const LoginFunc = async (username, password) => {
    const uselogin = await request.post('/authenticate', { username: username, password: password })

    if (uselogin.data.status == 200) {
        return uselogin.data
    } else {
        return false
    }

}

export const LogoutFunc = async () => {
    const uselogout = await request.post('/logout', {})

    if (uselogout.data.status == 200) {
        return true
    } else {
        return false
    }

}

export const UploadFunc = async (formData) => {
    const fileUpload = await request.post('/uploadFile', formData)
    
    if (fileUpload.data.status == 200) {
        return fileUpload.data
    } else {
        return false
    }
}

export const DownLoadFunc = async (flName) => {
    const fileDownload = await downloadRequest.post('/downloadFile', { fl: flName })
    const fetchedFile = new File([fileDownload.data], flName);
    const a = document.createElement('a');
    a.download = flName;
    const blob = new Blob([fetchedFile]);
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
        URL.revokeObjectURL(a.href)
    });
    a.click();
}

export const DeleteFunc = async (flname) => {
    const fileDelete = await request.post('/deleteFile', { fl: flname })
    if (fileDelete.data.status == 200) {
        return fileDelete.data
    } else {
        return false
    }
}