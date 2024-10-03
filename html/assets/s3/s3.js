function getBucketname() {
    var selectedEement = document.getElementById("bucket");
    var bucket = selectedEement.value;
    return bucket;
}

function getSelectedFolder() {
    var selectedEement = document.getElementById("folderPrefix");
    var folder = selectedEement.value;
    return folder;
}

/**
 * FormのFolderに追加
 * @param {*} folders 
 */
function appendFolderPrefix(folders = []){
    var selectedEement = document.getElementById("folderPrefix");
    var selectedValue = selectedEement.value;
    if(folders.length == 0){
        folders.push("");        
    }
    var options = "";
    folders.forEach(f=>{
        if(selectedValue && selectedValue == f){
            options += `<option value="${f}" selected>${f}</option>`
        }else{
            options += `<option value="${f}">${f}</option>`
        }
    })
    selectedEement.innerHTML = options;
}

function getFolderPrefix(filename){
    if(!filename || filename == ""){
        return "";
    }
    var paths = (filename || "").split("/");
    if(paths.length == 1){
        return "";
    }else{
        return paths.slice(0, paths.length-1).join("/")
    }
}

/**
 * Get file list in bucket by presigned download URL
 */
async function getFileList(folder="") {
    try{
        const bucket = getBucketname();
        if(bucket == ""){
            alert("Storageを選択してください");
            return;
        }

        getParentFolderLink(folder);

        //const apiUrl = "https://8pk0bucef4.execute-api.ap-northeast-1.amazonaws.com/dev/getfilelist";
        const apiUrl = "https://8pk0bucef4.execute-api.ap-northeast-1.amazonaws.com/dev/getfilemetadata";
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"bucketname": bucket, "folder": `${folder}`})
        })
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);  
        }
        var data = await response.json();
        console.log(data)
        const fileList = JSON.parse(data.body);
        var files = ""
        var folders = [""];
        fileList.filter(f=>f.ObjectName != folder).forEach(file=>{
            files += createObjectLine(file, bucket, folders);
        });
        document.getElementById("filelist").innerHTML = files;
        if(!folder || folder == "" ){
            appendFolderPrefix(folders);        
        }
    } catch (error) {  
        console.error('Error:', error);  
    }
}

function getParentFolderLink(folder) {
    if(folder != "" && ("" + folder.endsWith("/"))){
        const nFolders = folder.split("/").filter(f=>f!="");
        const pfolder=nFolders.length == 1? "" : nFolders.slice(0, nFolders.length-1).join("/");
        document.getElementById("plink").innerHTML=`<a href="#" style="padding-left: 20px" onclick="getFileList('${pfolder}')">Go to parent folder </a>`;
    }else{
        document.getElementById("plink").innerHTML= "";
    }
}

function createObjectLine(file, bucket, folders=undefined){    
    var size = file.SizeInBytes/1024;
    if(size <= 1024){
        strSize = size.toFixed(1) + "K";
    }else {
        strSize = (size/1024).toFixed(1) + "M";        
    }
    if((""+file.ObjectName).endsWith("/")){
        if(folders) folders.push(file.ObjectName);

        //it is folder
        return `<tr><td class="body-item mbr-fonts-style display-7"><a href="#" onclick="getFileList('${file.ObjectName}')">${file.ObjectName}</a>
        <br>${file.LastModified.substring(0, file.LastModified.length-5)}</td> 
        <td class="body-item mbr-fonts-style display-7"></td></tr>`;

    }else{
        // it is file
        return `<tr> <td class="body-item mbr-fonts-style display-7 text-primary"><button class="btn-primary display-7" onclick="play('${file.ObjectName}','${file.ContentType}')">${file.ObjectName}</button>
        <br>${file.LastModified.substring(0, file.LastModified.length-5)}
        </td>
         <td class="body-item mbr-fonts-style display-7">
            <div style="white-space: nowrap;">
                <a href="#" onclick="downloadFile('${file.ObjectName}')"><i class="fa-solid fa-download table-item"></i></a>
                <a href="#" disabled onclick="confirmAction(deleteObject, '${file.ObjectName}')"><i class="fa-solid fa-trash table-item"></i></a>
            </div>
            <span>${strSize}</span>         
         </td></tr>`;
    }
}

/**
 * Upload file to S3 by presigned upload URL
 * @returns 
 */
async function uploadFile() {  
    const bucket = getBucketname();
    if(bucket == ""){
        alert("Storageを選択してください");
        return;
    }

    const fileInput = document.getElementById('fileInput');  
    if (!fileInput.files.length) {  
        alert('Please select a file first.');  
        return;  
    }  
      
    const folderPrefix = getSelectedFolder();
    if(folderPrefix != "" && !folderPrefix.endsWith("/")){
        alert("Folder prefix must be empty or endwith slash /");
        return;
    }

    const file = fileInput.files[0];     
    //const formData = new FormData();  
    //formData.append('file', file); // Note: S3 presigned URLs often don't require 'file' as the key, but it depends on your setup  
    
    // Replace 'YOUR_PRESIGNED_URL' with your actual presigned URL  
    const apiUrl = 'https://8pk0bucef4.execute-api.ap-northeast-1.amazonaws.com/dev/geturl';  
    const filename = `${folderPrefix}${file.name}`;
    const contentType = file.type;
    alert(`Upload: ${file.name} into S3 ${filename}`);
    try {  
        var response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"bucketname": bucket, "filename": `${filename}`, "type": `${contentType}`, "expiration": `${3*3600}`})
        })
        if(!response.ok){
            throw new Error(`Get presigned url error! status: ${response.status}`);  
        }
        var data = await response.json();
        console.log(data);
        const presignedUrl = JSON.parse(data.body).presignedUrl;
        //alert("URL: " + presignedUrl);
        //console.log('Successed to get presignedUrl: ', presignedUrl);

        //animation start
        document.getElementById('loader').style.display = 'block';  


        // Send the file to S3 using the presigned URL  
        response = await fetch(presignedUrl, {  
            method: 'PUT',  
            body: file, // Directly sending the file without FormData if S3 expects just the file  
            headers: {  
                "Content-Type": contentType
                // but include them here if needed  
            }  
        });  
  
        if (!response.ok) {  
            throw new Error(`HTTP error! status: ${response.status}`);  
        }  
        console.log("result", response);
        //data = await response.json(); // Assuming S3 returns some JSON (it might not)  
        console.log('Successed to upload file to S3:', file.name, response);  
        //alert(`File uploaded successfully! ${filename}`);  

        playUploaded(filename, contentType);
        getFileList(getFolderPrefix(filename));
        return {
            "url": `https://${bucket}.s3-website-ap-northeast-1.amazonaws.com/${filename}` 
        }      
    } catch (error) {  
        console.error('Error:', error);  
        alert(`Error uploading file!: ${filename}`);  
    } finally {
        //animation end
        document.getElementById('loader').style.display = 'none'; 
    } 
}  

function confirmAction(doAction, filename) {  
    // Use the confirm function to display a confirmation dialog box  
    var userResponse = confirm(`Are you sure you want to delete ${filename}?`);  
    // Check the user's response  
    if (userResponse === true) {  
        deleteObject(filename);
        return true;
    } else {  
       return false; 
    }  
}  

/**
 * Delete object in S3
 * @param {*} filename 
 */
async function deleteObject(filename) {
    var deleteKey = document.getElementById("deleteKey");
    if(!deleteKey || deleteKey.value != "delete@me"){
        alert("削除権限がありません!");
        return;
    }

    try{
        const bucket = getBucketname();
        if(bucket == ""){
            alert("Storageを選択してください");
            return;
        }

        const apiUrl = "https://8pk0bucef4.execute-api.ap-northeast-1.amazonaws.com/dev/delete";
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"bucketname": bucket, "filename": `${filename}`})
        })
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);  
        }
        getFileList(getFolderPrefix(filename));
    } catch (error) {  
        console.error('Error:', error);  
    }
}

/**
 * Download file by presigned URL
 * @returns 
 */
async function downloadFile(filename) {  
    const bucket = getBucketname();
    if(bucket == ""){
        alert("Storageを選択してください");
        return;
    }

    if(filename != "" && filename.endsWith("/")){
        alert("Can not download a folder");
        return;
    }
      
    // Replace 'YOUR_PRESIGNED_URL' with your actual presigned URL  
    const apiUrl = 'https://8pk0bucef4.execute-api.ap-northeast-1.amazonaws.com/dev/getdownloadurl';  
    try {  
        var response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"bucketname": bucket, "filename": `${filename}`, "expiration": `${12*3600}`})
        })
        if(!response.ok){
            throw new Error(`Get presigned url error! status: ${response.status}`);  
        }
        var data = await response.json();
        console.log(data);
        const presignedUrl = JSON.parse(data.body).presignedUrl;
        console.log('Download presignedUrl: ', presignedUrl);

        var a = document.createElement('a');  
        a.href = presignedUrl;          
        a.download = filename.substring(filename.lastIndexOf("/") + 1);
        document.body.appendChild(a);               
        a.click();
        document.body.removeChild(a);
    } catch (error) {  
        console.error('Error:', error);  
        alert(`Error download object!: ${filename}`);  
    }  
}  
 

/**
 * Play list file
 * @returns 
 */
async function play(filename, contentType) {  
    const bucket = getBucketname();
    if(bucket == ""){
        alert("Storageを選択してください");
        return;
    }

    if(filename != "" && (""+filename).endsWith("/")){
        return;
    }

    const url = `https://${bucket}.s3-ap-northeast-1.amazonaws.com/${filename}`;
    console.log("url: ", url);

    var video;
    var image;
    
    if(contentType.lastIndexOf("image") >=0 ){
        
        if(video){
            try{
                video.pause();
            }catch{}
        }
        var name = document.getElementById("filenameimage");
        name.innerText = filename;

        image = document.getElementById("myimage");
        image.setAttribute("src", url); 
        
        document.getElementById("video1-y").style.display = "none";
        document.getElementById("image1-y").style.display = "block";

        var div = document.querySelector('#myview');
        if(div){
            div.scrollIntoView({ behavior: 'smooth' });
        }
    }else if(contentType.lastIndexOf("video") >=0 ){
        var name = document.getElementById("filenamevideo");
        name.innerText = filename;

        video = document.getElementById("myvideo");
        var firstSource = video.getElementsByTagName('source')[0];      
        firstSource.src = url;  
        video.load();      
        video.play();  

        document.getElementById("video1-y").style.display = "block";
        document.getElementById("image1-y").style.display = "none";

        var div = document.querySelector('#myview');
        if(div){
            div.scrollIntoView({ behavior: 'smooth' });
        }
    }

}

/**
 * Play uploaded
 * @returns 
 */
async function playUploaded(filename, contentType) {  
    const bucket = getBucketname();
    if(bucket == ""){
        alert("Storageを選択してください");
        return;
    }

    if(filename != "" && (""+filename).endsWith("/")){
        return;
    }

    const url = `https://${bucket}.s3-ap-northeast-1.amazonaws.com/${filename}`;
    console.log("url: ", url);

    var video;
    var image;
    
    if(contentType.lastIndexOf("image") >=0 ){        
        if(video){
            try{
                video.pause();
            }catch{}
        }
        image = document.getElementById("myimage-x");
        image.setAttribute("src", url);         
        document.getElementById("video1-x").style.display = "none";
        document.getElementById("image1-x").style.display = "block";
    }else if(contentType.lastIndexOf("video") >=0 ){
        video = document.getElementById("myvideo-x");
        var firstSource = video.getElementsByTagName('source')[0];      
        firstSource.src = url;  
        video.load();      
        video.play();  
        document.getElementById("video1-x").style.display = "block";
        document.getElementById("image1-x").style.display = "none";
    }
}
