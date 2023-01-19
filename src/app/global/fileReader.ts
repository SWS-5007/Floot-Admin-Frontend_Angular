import { FileData } from "../components/venues/venue-profile/venue-profile.component";

export default async function transformFile(file: File) :Promise<FileData>{
    return new Promise((resolve, reject) => {
      try{
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (reader) => {
          const fileObj = {
            buffer: reader.target.result,
            meta: {
              fileName: file.name,
              fileType: file.type
            }
          }
          resolve(fileObj);
        }
      }
      catch(err){
        reject(err);
      }
    })
  }